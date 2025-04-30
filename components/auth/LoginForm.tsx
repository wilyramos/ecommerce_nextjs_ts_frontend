"use client" // This is a client component

// import { useActionState } from 'react'
import { useFormState } from 'react-dom'
import { useEffect, useRef } from 'react'


export default function LoginForm() {

    // For reset form after submit
    const ref = useRef<HTMLFormElement>(null)

    return (
        <form
            ref={ref}
            className="mt-2 space-y-2 text-gray-700"
            noValidate
        // action={}
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

            <div className="flex flex-col gap-1">
                <label
                    className="font-bold  "
                >Password</label>
                <input
                    type="password"
                    placeholder="Password de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="password"
                />
            </div>

            <button
                type='submit'
                className='bg-blue-500 text-white font-bold py-3 rounded-full w-full hover:bg-blue-600 transition duration-200 ease-in-out'
            >Iniciar Sesión</button>
        </form>
    )
}