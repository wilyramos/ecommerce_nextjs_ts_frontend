"use client" // This is a client component

// import { useActionState } from 'react'

import { useEffect } from 'react'
import { authenticateUserAction } from '@/actions/authenticate-user-action'
import { useActionState } from 'react'
import { toast } from 'react-toastify'
 

export default function LoginForm() {

    // For reset form after submit
    // const ref = useRef<HTMLFormElement>(null)


    const [ state, dispatch] = useActionState(authenticateUserAction, {
        errors: [],
        success: ""
    })

    console.log("State:", state)
    console.log("Errors:", state.errors)
    console.log("Success:", state.success)

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
            // ref={ref}
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