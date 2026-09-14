import type { Metadata } from "next"
import LoginForm from "@/components/auth/LoginForm"
import { H1, Muted } from "@/components/ui/TypographyV3"

export const metadata: Metadata = {
  title: "GoPhone - Iniciar Sesión",
  description: "Inicia sesión en tu cuenta de GoPhone para acceder a tus pedidos, favoritos y más.",
  keywords: "iniciar sesión, GoPhone, cuenta",
}

export default function PageLogin() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <H1 className="text-xl sm:text-2xl">Iniciar sesión</H1>
        <Muted>Ingresa a tu cuenta para gestionar tus compras.</Muted>
      </div>

      <LoginForm />
    </div>
  )
}