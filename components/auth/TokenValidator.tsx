'use client'

import { useEffect } from "react"
import { useActionState } from "react"
import { validateToken } from "@/actions/validate-token-action"

interface TokenValidatorProps {
  token: string
  onSuccess: () => void
  onError: (errors: string[]) => void
}

export default function TokenValidator({ token, onSuccess, onError }: TokenValidatorProps) {
  const validateTokenInput = validateToken.bind(null, token)

  const [state, dispatch] = useActionState(validateTokenInput, {
    errors: [],
    success: ""
  })

  useEffect(() => {
    if (state.success) {
      onSuccess()
    }
    if (state.errors.length > 0) {
      onError(state.errors)
    }
  }, [state, onSuccess, onError])

  return (
    <form action={dispatch} className="hidden">
      <button type="submit" hidden />
    </form>
  )
}
