import type { Metadata } from "next"
import RegisterForm from "@/components/auth/RegisterForm"
import { H1, Muted } from "@/components/ui/TypographyV3"

export const metadata: Metadata = {
  title: "Crea tu cuenta | GoPhone",
  description: "Regístrate en GoPhone y accede a los mejores dispositivos y accesorios.",
  keywords: "registro, GoPhone, cuenta, apple",
}

export default function PageRegistro() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1 text-center">
        <H1 className="text-xl sm:text-2xl">Crea tu cuenta</H1>
        <Muted>Ingresa tus datos para comenzar tu experiencia GoPhone.</Muted>
      </div>

      <RegisterForm />
    </div>
  )
}