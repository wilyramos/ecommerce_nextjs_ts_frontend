'use client';

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { authenticateUserAction } from "@/actions/authenticate-user-action";
import { googleLoginAction } from "@/actions/auth/google-login-action";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

// Tipar el estado que retorna useActionState
interface AuthState {
    errors: string[];
    success: string;
}

export default function LoginForm() {
    const [state, dispatch] = useActionState<AuthState, FormData>(
        authenticateUserAction,
        {
            errors: [],
            success: "",
        }
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isPending, startTransition] = useTransition();

    // Mostrar errores o éxito del login tradicional
    useEffect(() => {
        state.errors.forEach(error => toast.error(error));
        if (state.success) toast.success(state.success);
    }, [state]);

    // Login con Google
    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido");

        startTransition(async () => {
            const result = await googleLoginAction({ credential });
            if (result?.error) {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="mt-4 space-y-4 text-gray-700">
            <form noValidate action={dispatch}>
                <label className="block font-medium">
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="block font-medium relative">
                    Password
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="********"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-xl text-gray-600 hover:text-gray-800"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </label>

                <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded-full transition-colors cursor-pointer mt-2"
                >
                    Iniciar Sesión
                </button>
            </form>

            <div className="flex items-center justify-center gap-2">
                <span className="text-sm text-gray-500">o inicia sesión con</span>
            </div>

            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al iniciar sesión con Google")}
                />
            </div>
        </div>
    );
}
