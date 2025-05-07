import PasswordResetHandler from '@/components/auth/PasswordResetHandler'
import React from 'react'

export default function NewPasswordPage() {
    return (
        <>

            <h1 className='text-2xl'>
                Reestablecer contraseña
            </h1>
            <p className="text-xl font-bold">Ingresa el codigo de verificación</p>

            <PasswordResetHandler />
        </>
    )
}
