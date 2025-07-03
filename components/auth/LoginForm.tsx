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
                    Password
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


                <button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded-full transition-colors cursor-pointer mt-2"
                    disabled={isPending}
                >
                    Iniciar Sesión
                </button>
            </form>

            <div className="relative text-center text-sm text-gray-500 my-5">
                <hr className="border-gray-300 mb-2" />

                <span className="bg-white px-2 absolute -top-3 left-1/2 -translate-x-1/2">o inicia sesión con</span>

            </div>

            <div className="flex justify-center ">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al iniciar sesión con Google")}
                    // onFailure={() => toast.error("Error al iniciar sesión con Google")}
                    size="large"
                    shape="circle"
                />
            </div>
        </div>
    );
}
