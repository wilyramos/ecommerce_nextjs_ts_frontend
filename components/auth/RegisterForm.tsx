'use client';

import { useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { createAccountAction } from '@/actions/create-account-action';
import { googleLoginAction as googleRegisterAction } from '@/actions/auth/google-login-action';
import { GoogleLogin } from '@react-oauth/google';
import { CredentialResponse } from '@react-oauth/google';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SuccessResponse {
    message: string;
    userId: string;
    token: string;
}

export default function RegisterForm() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/profile";

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

    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido");

        startTransition(async () => {
            const result = await googleRegisterAction({ credential, redirectTo });
            if (result?.error) toast.error(result.error);
        });
    };

    return (
        <div className="mt-4 space-y-4 text-gray-700 text-sm">

            {/* Google primero */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error('Error al registrarte con Google')}
                    size="large"
                    shape="circle"
                />
            </div>

           
            <div className="relative text-center text-sm text-black my-6">
                <hr className="border-gray-300 mb-2" />
                <span className="bg-gray-100 px-2 absolute -top-3 left-1/2 -translate-x-1/2 font-bold">
                    O bien
                </span>
            </div>

            {/* Formulario después */}
            <form action={dispatch}>
                <label htmlFor="email" className="text-sm font-bold">
                    Email
                    <input
                        type="email"
                        name="email"
                        className="mt-1 w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
                        id="email"
                        required
                        placeholder='tu@email.com'
                    />
                </label>

                <label className="text-sm font-bold">Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    className="mt-1 w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
                    id="nombre"
                    required
                    placeholder='Tu nombre'
                />

                <label className="text-sm font-bold">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    className="mt-1 w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
                    required
                    placeholder='********'
                />

                <input
                    type="submit"
                    value="Crear cuenta"
                    className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded transition-colors cursor-pointer mt-2"
                    disabled={isPending}
                />

                <input type="hidden" name="redirect" value={redirectTo} />
            </form>

            <nav className="text-sm text-gray-600 my-5 text-center">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href={
                            searchParams.get("redirect")
                                ? `/auth/login?redirect=${searchParams.get("redirect")}`
                                : "/auth/login"
                        }
                        className="text-black font-black hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </nav>
        </div>
    );
}
