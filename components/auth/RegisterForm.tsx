'use client';

import { useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { createAccountAction } from '@/actions/create-account-action';
import { googleLoginAction as googleRegisterAction } from '@/actions/auth/google-login-action';
import { GoogleLogin } from '@react-oauth/google';
import { CredentialResponse } from '@react-oauth/google';


interface SuccessResponse {
    message: string;
    userId: string;
    token: string;
}

export default function RegisterForm() {
    const [state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: {} as SuccessResponse,
    });

    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success?.message) {
            toast.success(state.success.message);
        }
    }, [state]);

    // Ejecutar la funcion en caso de registro exitoso de Google
      const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
            if (!credential) return toast.error("Token de Google no recibido");
    
            startTransition(async () => {
                const result = await googleRegisterAction({ credential });
                if (result?.error) {
                    toast.error(result.error);
                }
            });
        };


    return (
        <div className="mt-2 space-y-4 text-gray-700">
            <form action={dispatch} className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    className="w-full rounded-lg border border-gray-300 px-2 py-1"
                    id="email"
                    required
                />

                <label className="block text-sm font-semibold text-gray-800">Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    className="w-full rounded-lg border border-gray-300 px-2 py-1"
                    id="nombre"
                    required
                />

                <label className="block text-sm font-semibold text-gray-800">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    className="w-full rounded-lg border border-gray-300 px-2 py-1"
                    required
                />

                <label className="block text-sm font-semibold text-gray-800">
                    Repetir Contraseña
                </label>
                <input
                    type="password"
                    name="password_confirmation"
                    className="w-full rounded-lg border border-gray-300 px-2 py-1"
                    required
                />

                <input
                    type="submit"
                    value="Crear cuenta"
                    className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded-full transition-colors cursor-pointer mt-2"
                />
            </form>

            <div className="relative text-center text-sm text-gray-500 mt-4">
                <hr className="border-gray-300 mb-2" />
                <span className="bg-white px-2 absolute -top-3 left-1/2 -translate-x-1/2">o regístrate con</span>
            </div>

            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error('Error al registrarte con Google')}
                />
            </div>
        </div>
    );
}