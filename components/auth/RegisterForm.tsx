'use client'

import { useEffect, useTransition } from "react"
import { useActionState } from "react"
import { toast } from "sonner"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { createAccountAction } from "@/actions/create-account-action"
import { googleLoginAction as googleRegisterAction } from "@/actions/auth/google-login-action"
import { Input } from "../ui/input"

interface SuccessResponse {
    message: string
    userId: string
    token: string
}

export default function RegisterForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/profile"

    const [state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: {} as SuccessResponse,
    })

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
        if (state.success?.message) {
            toast.success(state.success.message)
        }
    }, [state])

    const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
        if (!credential) return toast.error("Token de Google no recibido")

        startTransition(async () => {
            const result = await googleRegisterAction({ credential, redirectTo })
            if (result?.error) toast.error(result.error)
        })
    }

    return (
        <div className="mt-4 space-y-4 text-gray-700 text-sm">
            
            {/* Google Login */}
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => toast.error("Error al registrarte con Google")}
                    size="large"
                    shape="circle"
                />
            </div>

            {/* Divider */}
            <div className="relative text-center text-sm text-black my-6">
                <hr className="border-gray-300 mb-2" />
                <span className="bg-gray-100 px-2 absolute -top-3 left-1/2 -translate-x-1/2">
                    O bien
                </span>
            </div>

            {/* Formulario */}
            <form action={dispatch}>
                
                {/* Email */}
                <label htmlFor="email" className="text-sm">
                    Email
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="tu@email.com"
                        className="mt-1"
                    />
                </label>

                {/* Nombre */}
                <label htmlFor="nombre" className="text-sm block mt-4">
                    Nombre
                </label>
                <Input
                    id="nombre"
                    type="text"
                    name="nombre"
                    required
                    placeholder="Tu nombre"
                    className="mt-1"
                />

                {/* Password */}
                <label htmlFor="password" className="text-sm block mt-4">
                    Contraseña
                </label>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    placeholder="********"
                    className="mt-1"
                />

                {/* Submit */}
                <input
                    type="submit"
                    value="Crear cuenta"
                    disabled={isPending}
                    className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded transition-colors cursor-pointer mt-4"
                />

                <input type="hidden" name="redirect" value={redirectTo} />
            </form>

            {/* Link a login */}
            <nav className="text-xs text-gray-600 my-5 text-center">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href={
                            searchParams.get("redirect")
                                ? `/auth/login?redirect=${searchParams.get("redirect")}`
                                : "/auth/login"
                        }
                        className="text-black font-semibold hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </nav>
        </div>
    )
}
