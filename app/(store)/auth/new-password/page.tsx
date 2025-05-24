import PasswordResetHandler from '@/components/auth/PasswordResetHandler'
import { Suspense } from 'react'

export default function NewPasswordPage() {

    return (
        <>

            <h1 className='text-2xl text-center font-bold '>
                Reestablecer contraseña
            </h1>
            <p className="text-xl text-center">Ingresa el codigo de verificación</p>

            <Suspense fallback={<p className="text-center">Cargando...</p>}>
                <PasswordResetHandler />
            </Suspense>
        </>
    )
}
