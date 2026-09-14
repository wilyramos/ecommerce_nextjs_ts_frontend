'use client'

import { useActionState, useEffect, useTransition } from "react"
import { resetPassword } from "@/actions/reset-password-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { InputV3 } from "@/components/ui/InputV3"
import { ButtonV3 } from "@/components/ui/ButtonV3"
import { H2, Muted } from "@/components/ui/TypographyV3"

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const resetPasswordWithToken = resetPassword.bind(null, token)
  const [state, dispatch] = useActionState(resetPasswordWithToken, {
    errors: [],
    success: "",
  })

  useEffect(() => {
    if (state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error))
    }
    if (state.success) {
      toast.success(state.success)
      router.push("/auth/login")
    }
  }, [state, router])

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData)
    })
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1.5 text-center">
        <H2 className="text-xl sm:text-2xl">Nueva contraseña</H2>
        <Muted>Ingresa y confirma tu nueva clave de acceso.</Muted>
      </div>

      <form className="space-y-3.5" noValidate action={handleSubmit}>
        <InputV3
          id="password"
          name="password"
          type="password"
          label="Nueva contraseña"
          required
          autoComplete="new-password"
        />

        <InputV3
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          label="Repetir contraseña"
          required
          autoComplete="new-password"
        />

        <ButtonV3
          type="submit"
          size="full"
          disabled={isPending}
          className="mt-1"
        >
          {isPending ? "Guardando..." : "Guardar contraseña"}
        </ButtonV3>
      </form>
    </div>
  )
}