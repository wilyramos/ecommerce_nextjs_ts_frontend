// frontend/app/(store)/auth/new-password/page.tsx
import type { Metadata } from "next"
import PasswordResetHandler from "@/components/auth/PasswordResetHandler"
import { H1, Muted } from "@/components/ui/TypographyV3"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Restablecer Contraseña | GoPhone",
    description: "Ingresa tu nueva clave de acceso para tu cuenta de GoPhone.",
}

export default function NewPasswordPage() {
    return (
        <div className="w-full space-y-6">
            <div className="space-y-1.5 text-center">
                <H1 className="text-xl sm:text-2xl">Restablecer contraseña</H1>
                <Muted>Ingresa el código de verificación o confirma tu nueva clave.</Muted>
            </div>

            <Suspense
                fallback={
                    <div className="my-8 text-center">
                        <Muted className="animate-pulse">Cargando verificación...</Muted>
                    </div>
                }
            >
                <PasswordResetHandler />
            </Suspense>
        </div>
    )
}