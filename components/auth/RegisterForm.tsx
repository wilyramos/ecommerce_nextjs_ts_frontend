"use client" 

// import { useActionState } from 'react'
import { createAccountAction } from '@/actions/create-account-action'
import { register } from 'module'
import { useActionState } from 'react'
import ErrorMessage from '../ui/ErrorMessage'


export default function RegisterForm() {

    const [ state, dispatch] = useActionState(createAccountAction, {
        errors: [],
        success: ""
    })




    
    
    return (
        <form
            // ref={ref}
            className="mt-2 space-y-2 text-gray-700"
            noValidate
            action={dispatch}
        >

            {state.errors.map(error => <ErrorMessage key={error}>{error}</ErrorMessage>)}
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
                >Nombre</label>
                <input
                    type="nombre"
                    placeholder="Nombre de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="nombre"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label
                    className="font-bold "
                >Password</label>
                <input
                    type="password"
                    placeholder="Password de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="password"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label
                    className="font-bold "
                >Repetir Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    placeholder="Repite Password de Registro"
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    name="password_confirmation"
                />
            </div>

            <input
                type="submit"
                value='Registrarme'
                className="bg-slate-950 hover:bg-slate-800 w-full p-3 rounded-2xl text-white font-black text-xl cursor-pointer block "
            />
        </form >
    )
}