'use client';

import { useState, useEffect, useTransition } from "react";
import { useActionState } from "react";
import { authenticateUserAction } from "@/actions/authenticate-user-action";
import { googleLoginAction } from "@/actions/auth/google-login-action";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface AuthState {
    errors: string[];
    success: string;
}

export default function LoginForm() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/profile";

    const [state, dispatch] = useActionState<AuthState, FormData>(
        authenticateUserAction,
        { errors: [], success: "" }
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        state.errors.forEach(error => toast.error(error));
        if (state.success) {
            toast.success(state.success);
            // router.push(redirectTo);
        }
    }, [state]);

    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido");

        startTransition(async () => {
            const result = await googleLoginAction({ credential, redirectTo });
            if (result?.error) toast.error(result.error);
        });
    };

    return (
        <div className="mt-4 space-y-5 text-gray-700">

            {/* Google Login primero */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al iniciar sesión con Google")}
                    size="large"
                    shape="circle"
                    width={300}
                />
            </div>

            <div className="relative text-center text-sm text-black my-6">
                <hr className="border-gray-300 mb-2" />
                <span className="bg-gray-100 px-2 absolute -top-3 left-1/2 -translate-x-1/2 font-bold">
                    O bien
                </span>
            </div>

            {/* Formulario clásico */}
            <form noValidate action={dispatch}>
                <label className="text-sm font-bold">
                    Email
                    <input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        className="mt-1 w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="text-sm font-bold">
                    Contraseña
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="********"
                            className="mt-1 w-full rounded-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-800 font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-all"
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                </label>

                <input type="hidden" name="redirect" value={redirectTo} />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full transition-colors cursor-pointer mt-2"
                    disabled={isPending}
                >
                    Iniciar Sesión
                </button>
            </form>

            {/* Links */}
            <nav className="flex justify-between text-sm text-gray-600 font-base my-4">
                <p>
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href={
                            searchParams.get("redirect")
                                ? `/auth/registro?redirect=${searchParams.get("redirect")}`
                                : "/auth/registro"
                        }
                        className="text-black font-black hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
                <p>
                    ¿Olvidaste tu contraseña?{" "}
                    <Link
                        href="/auth/forgot-password"
                        className="text-black font-black hover:underline"
                    >
                        Recuperar acceso
                    </Link>
                </p>
            </nav>
        </div>
    );
}
