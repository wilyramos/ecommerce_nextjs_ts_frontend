'use client'

import { forgotPassword } from "@/actions/forgot-password-action"
import { useActionState, useEffect, useRef, useTransition } from "react"
import { toast } from "sonner"
import { InputV3 } from "@/components/ui/InputV3"
import { ButtonV3 } from "@/components/ui/ButtonV3"
import { H2, P } from "@/components/ui/TypographyV3"

export default function ForgotPasswordForm() {
  const emailRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [state, dispatch] = useActionState(forgotPassword, {
    errors: [],
    success: "",
  })

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error))
    }
  }, [state])

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      dispatch(formData)
    })
  }

  if (state.success && emailRef.current?.value) {
    return (
      <div className="space-y-2 text-center">
        <H2 className="text-lg text-status-success">Correo enviado</H2>
        <P className="text-xs text-text-secondary sm:text-sm">
          Hemos enviado las instrucciones a{" "}
          <span className="font-semibold text-text-primary">
            {emailRef.current.value}
          </span>
          . Revisa tu bandeja de entrada o la carpeta de spam.
        </P>
      </div>
    )
  }

  return (
    <form className="space-y-3.5" noValidate action={handleSubmit}>
      <InputV3
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        required
        autoComplete="email"
        ref={emailRef}
      />

      <ButtonV3
        type="submit"
        size="full"
        disabled={isPending}
        className="mt-1"
      >
        {isPending ? "Enviando..." : "Recuperar contraseña"}
      </ButtonV3>
    </form>
  )
}