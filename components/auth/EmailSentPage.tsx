"use client"

import { forgotPassword } from '@/actions/forgot-password-action'
import { useActionState, useEffect, useRef } from 'react'
import { toast } from "sonner"

export default function ForgotPasswordForm() {
    const emailRef = useRef<HTMLInputElement>(null)

    const [state, dispatch] = useActionState(forgotPassword, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach(error => toast.error(error))
        }
    }, [state])

    if (state.success && emailRef.current?.value) {
        return (
            <div className="my-10">
                <h2 className="text-2xl font-bold mb-4">Correo enviado</h2>
                <p className="text-gray-400">
                    Hemos enviado un enlace para restablecer tu contraseña a {emailRef.current.value}. Por favor, revisa tu bandeja de entrada.
                </p>
            </div>
        )
    }

    return (
        <form
            className="mt-10 space-y-6 bg-[#141414] p-6 rounded-2xl shadow-lg text-white"
            noValidate
            action={dispatch}
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-[#333] text-white border border-[#555] p-3 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                    ref={emailRef}
                />
            </div>

            <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition duration-200"
            >
                Recuperar Contraseña
            </button>
        </form>
    )
}
