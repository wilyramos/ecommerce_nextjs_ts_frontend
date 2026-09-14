"use client"

import { useEffect, useTransition } from "react"
import { useActionState } from "react"
import { toast } from "sonner"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { createAccountAction } from "@/actions/create-account-action"
import { googleLoginAction as googleRegisterAction } from "@/actions/auth/google-login-action"
import { InputV3 } from "@/components/ui/InputV3"
import { ButtonV3 } from "@/components/ui/ButtonV3"
import { Hr, Small } from "@/components/ui/TypographyV3"

interface SuccessResponse {
  message: string
  userId: string
  token: string
}

export default function RegisterForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/profile"

  const [state, dispatch] = useActionState(createAccountAction, {
    errors: [],
    success: {} as SuccessResponse,
  })

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error))
    }
    if (state.success?.message) {
      toast.success(state.success.message)
    }
  }, [state])

  const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
    if (!credential) return toast.error("Token de Google no recibido")

    startTransition(async () => {
      const result = await googleRegisterAction({ credential, redirectTo })
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => toast.error("Error al registrarte con Google")}
          size="large"
          shape="rectangular"
          theme="outline"
          width="100%"
        />
      </div>

      <div className="relative my-4 text-center">
        <Hr className="my-0" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-primary px-3 text-[11px] uppercase tracking-wider text-text-tertiary">
          o continúa con
        </span>
      </div>

      <form action={dispatch} className="space-y-3.5">
        <InputV3
          id="email"
          type="email"
          name="email"
          label="Correo electrónico"
          required
          autoComplete="email"
        />

        <InputV3
          id="nombre"
          type="text"
          name="nombre"
          label="Nombre completo"
          required
          autoComplete="name"
        />

        <InputV3
          id="password"
          type="password"
          name="password"
          label="Contraseña"
          required
          autoComplete="new-password"
        />

        <input type="hidden" name="redirect" value={redirectTo} />

        <ButtonV3
          type="submit"
          size="full"
          disabled={isPending}
          className="mt-1"
        >
          {isPending ? "Creando cuenta..." : "Crear cuenta"}
        </ButtonV3>
      </form>

      <div className="text-center">
        <Small className="text-text-secondary lowercase first-letter:uppercase">
          ¿Ya tienes cuenta?{" "}
          <Link
            href={`/auth/login${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
            className="font-semibold text-brand-primary hover:underline"
          >
            Inicia sesión
          </Link>
        </Small>
      </div>
    </div>
  )
}