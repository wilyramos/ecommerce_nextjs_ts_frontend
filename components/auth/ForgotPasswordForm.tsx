"use client"


import { forgotPassword } from '@/actions/forgot-password-action'
import { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'



export default function ForgotPasswordForm() {


    const [state, dispatch] = useActionState(forgotPassword, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
        if (state.success) {
            toast.success(state.success)
        }
    }, [state])


    return (
        <form
            className="mt-2 space-y-2 text-gray-700"
            noValidate
            action={dispatch}
        >
            <div className="flex flex-col gap-1">
                <label
                    className="font-bold "
                    htmlFor="email"
                >Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="email"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white font-bold py-3 rounded-full w-full hover:bg-blue-600 transition duration-200 ease-in-out cursor-pointer"
            >Recuperar Contraseña</button>
        </form>
    )
}