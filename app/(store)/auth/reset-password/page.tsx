import { Suspense } from "react"
import PasswordResetHandler from "@/components/auth/PasswordResetHandler"


export default function ResetPasswordPage() {
    return (
        <>
            <h1 className='text-2xl text-center font-bold '>
                Reestablecer contraseña
            </h1>

            <Suspense fallback={<p className="text-center">Cargando...</p>}>
                <PasswordResetHandler />
            </Suspense>

        </>
    )
}
