// File: frontend/app/auth/login/page.tsx

import type { Metadata } from "next"
import LoginForm from "@/components/auth/LoginForm"
import { H1 } from "@/components/ui/TypographyV3"

export const metadata: Metadata = {
  title: "GoPhone - Iniciar Sesión",
  description: "Inicia sesión en tu cuenta de GoPhone para acceder a tus pedidos, favoritos y más.",
  keywords: "iniciar sesión, GoPhone, cuenta",
}

export default function PageLogin() {
  return (
    <>
      <div className="space-y-1.5 text-center">
        <H1>Iniciar sesión</H1>
      </div>

      <LoginForm />
    </>
  )
}