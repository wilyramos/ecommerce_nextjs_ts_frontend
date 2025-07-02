"use client"

// import { useActionState } from 'react'
import { createAccountAction } from '@/actions/create-account-action'
import { useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


interface successResponse {
    message: string,
    userId: string,
    token: string
}

export default function RegisterForm() {


    const [state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: {} as successResponse
    })


    // const token = state.success?.token
    // console.log(token)
    // const message = state.success?.message
    const router = useRouter()

    // useEffect(() => {
    //     if (token) {
    //         toast.success(state.success.message)
    //         // Redirigir a la página de login
    //         router.push('/auth/login')
    //     }
    // }, [token, router])

    useEffect(() => {

        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
        if (state.success?.message) {
            toast.success(state.success?.message)
            // Redirigir a la página de login
            router.push('/auth/login')
        }

    }, [state, router])

    return (
        <form
            // ref={ref}
            className="mt-2 space-y-1 text-gray-700"
            noValidate
            action={dispatch}
        >

            {/* {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)} */}
            <label
                className="block text-sm font-semibold text-gray-500"
                htmlFor="email"
            >Email</label>
            <input
                id="email"
                type="email"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                name="email"
            />

            <label
                className="block text-sm font-semibold text-gray-500"
            >Nombre</label>
            <input
                type="nombre"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                name="nombre"
            />

            <label
                className="block text-sm font-semibold text-gray-500"
            >Password</label>
            <input
                type="password"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                name="password"
            />

            <label
                className="block text-sm font-semibold text-gray-500"
            >Repetir Password</label>
            <input
                id="password_confirmation"
                type="password"
                placeholder=""
                className="w-full rounded-lg border border-gray-300 px-2 py-1"
                name="password_confirmation"
            />

            <input
                type="submit"
                value="Crear cuenta"
                className="w-full bg-black hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors cursor-pointer mt-2"
            />
        </form >
    )
}