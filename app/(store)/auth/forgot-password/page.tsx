// frontend/app/(store)/auth/forgot-password/page.tsx
import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"
import { H1, Muted, Small } from "@/components/ui/TypographyV3"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Recuperar Contraseña | GoPhone",
  description: "Ingresa tu correo para recibir el enlace de recuperación de tu cuenta.",
}

export default function PageForgotPassword() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <H1 className="text-xl sm:text-2xl">Recuperar Contraseña</H1>
        <Muted>Ingresa tu correo electrónico para recibir el enlace.</Muted>
      </div>

      <ForgotPasswordForm />

      <nav className="space-y-2 border-t border-border-primary pt-4 text-center">
        <div>
          <Small className="text-text-secondary lowercase first-letter:uppercase">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-brand-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </Small>
        </div>

        <div>
          <Small className="text-text-secondary lowercase first-letter:uppercase">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/registro"
              className="font-semibold text-brand-primary hover:underline"
            >
              Regístrate
            </Link>
          </Small>
        </div>
      </nav>
    </div>
  )
}