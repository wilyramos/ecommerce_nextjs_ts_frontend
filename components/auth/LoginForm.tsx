"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { authenticateUserAction } from "@/actions/authenticate-user-action"
import { toast } from "react-toastify"
import { FiEye, FiEyeOff } from "react-icons/fi"

export default function LoginForm() {
    const [state, dispatch] = useActionState(authenticateUserAction, {
        errors: [],
        success: "",
    })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        state.errors.forEach(error => toast.error(error))
        if (state.success) toast.success(state.success)
    }, [state])

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
    )
}
