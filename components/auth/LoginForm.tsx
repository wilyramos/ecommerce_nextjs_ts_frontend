"use client"

import { useState, useEffect, useTransition } from "react"
import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google"

import { authenticateUserAction } from "@/actions/authenticate-user-action"
import { googleLoginAction } from "@/actions/auth/google-login-action"
import { InputV3 } from "@/components/ui/InputV3"
import { ButtonV3 } from "@/components/ui/ButtonV3"
import { Hr, Small } from "@/components/ui/TypographyV3"

interface AuthState {
  errors: string[]
  success: string
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/profile"

  const [state, dispatch] = useActionState<AuthState, FormData>(
    authenticateUserAction,
    { errors: [], success: "" }
  )

  const [showPassword, setShowPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    state.errors.forEach((error) => toast.error(error))
    if (state.success) toast.success(state.success)
  }, [state])

  const handleGoogleLoginSuccess = ({ credential }: CredentialResponse) => {
    if (!credential) return toast.error("Token de Google no recibido")

    startTransition(async () => {
      const result = await googleLoginAction({ credential, redirectTo })
      if (result?.error) toast.error(result.error)
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => toast.error("Error al iniciar sesión con Google")}
          size="large"
          shape="rectangular"
          theme="outline"
          width="100%"
        />
      </div>

      <div className="relative my-4 text-center">
        <Hr className="my-0" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-primary px-3 text-[11px] uppercase tracking-wider text-text-tertiary">
          o con correo
        </span>
      </div>

      <form noValidate action={dispatch} className="space-y-3.5">
        <InputV3
          id="email"
          type="email"
          name="email"
          label="Correo electrónico"
          required
          autoComplete="email"
        />

        <div className="relative">
          <InputV3
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            label="Contraseña"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3.5 text-text-tertiary transition-colors duration-fast hover:text-text-primary"
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>

        <input type="hidden" name="redirect" value={redirectTo} />

        <ButtonV3
          type="submit"
          size="full"
          disabled={isPending}
          className="mt-1"
        >
          {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
        </ButtonV3>
      </form>

      <div className="flex flex-col gap-2 pt-1 text-center sm:flex-row sm:justify-between">
        <Small className="text-text-secondary lowercase first-letter:uppercase">
          <Link
            href={`/auth/registro${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
            className="font-semibold text-brand-primary hover:underline"
          >
            Regístrate
          </Link>
        </Small>

        <Small className="text-text-secondary lowercase first-letter:uppercase">
          <Link
            href="/auth/forgot-password"
            className="text-text-tertiary transition-colors duration-fast hover:text-brand-accent hover:underline"
          >
            ¿Olvidaste tu clave?
          </Link>
        </Small>
      </div>
    </div>
  )
}