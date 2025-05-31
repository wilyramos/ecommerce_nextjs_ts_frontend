"use client"

import { useEffect, useState } from "react"
import { authenticateUserAction } from "@/actions/authenticate-user-action"
import { useActionState } from "react"
import { toast } from "react-toastify"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginForm() {
    const [state, dispatch] = useActionState(authenticateUserAction, {
        errors: [],
        success: "",
    })

    useEffect(() => {
        state.errors.forEach(error => toast.error(error))
        if (state.success) toast.success(state.success)
    }, [state])

    const [showPassword, setShowPassword] = useState(false)

    return (
        <form
            className="mt-4 space-y-4 text-gray-700"
            noValidate
            action={dispatch}
        >
            <label className="block font-medium">
                Email
                <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full rounded-full bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
            >
                Iniciar Sesión
            </button>
        </form>
    )
}
