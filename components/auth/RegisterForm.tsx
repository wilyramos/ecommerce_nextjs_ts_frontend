'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { createAccountAction } from '@/actions/create-account-action'
import ErrorMessage from '../ui/ErrorMessage'

interface SuccessResponse {
    message: string
    userId: string
    token: string
}

export default function RegisterForm() {

    const [state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: {} as SuccessResponse,
    })


    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error))
        }
        if (state.success?.message) {
            toast.success(state.success.message)
        }
    }, [state])

    return (
        <form 
            action={dispatch} className="mt-2 space-y-1" noValidate
            
        >
            {/* {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)} */}

            <label htmlFor="email" className="block text-sm font-semibold text-gray-800">
                Email
            </label>
            <input
                type="email"
                name="email"
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                id='email'
            />

            <label className="block text-sm font-semibold text-gray-800">Nombre</label>
            <input
                type="text"
                name="nombre"
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                id='nombre'
            />

            <label className="block text-sm font-semibold text-gray-800">Contraseña</label>
            <input
                type="password"
                name="password"
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
            />

            <label className="block text-sm font-semibold text-gray-800">
                Repetir Contraseña
            </label>
            <input
                type="password"
                name="password_confirmation"
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
            />

            <input
                type="submit"
                value="Crear cuenta"
                className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded-full transition-colors cursor-pointer mt-2"
            />
        </form>
    )
}