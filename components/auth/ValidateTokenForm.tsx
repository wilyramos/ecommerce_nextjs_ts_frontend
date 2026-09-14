"use client"

import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { validateToken } from "@/actions/validate-token-action"
import { useActionState } from "react"
import { toast } from "sonner"

type ValidateTokenProps = {
  setIsValidToken: Dispatch<SetStateAction<boolean>>
  token: string
  setToken: Dispatch<SetStateAction<string>>
}

export default function ValidateTokenForm({ setIsValidToken, token, setToken }: ValidateTokenProps) {
  const [isComplete, setIsComplete] = useState(false)

  const validateTokenInput = validateToken.bind(null, token)
  const [state, dispatch] = useActionState(validateTokenInput, {
    errors: [],
    success: "",
  })

  useEffect(() => {
    if (state.errors && state.errors.length > 0) {
      state.errors.forEach((error) => toast.error(error))
    }
    if (state.success) {
      toast.success(state.success)
      setIsValidToken(true)
    }
  }, [state, setIsValidToken])

  const handleChange = (val: string) => {
    setIsComplete(false)
    setToken(val)
  }

  const handleComplete = () => {
    setIsComplete(true)
  }

  return (
    <form action={dispatch} className="my-6">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <PinInput
          value={token}
          onChange={handleChange}
          onComplete={handleComplete}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <PinInputField
              key={index}
              className="h-12 w-10 sm:w-12 rounded-radius-md border border-border-primary bg-surface-primary text-center text-lg font-semibold text-text-primary shadow-xs outline-none transition-all duration-fast focus:border-brand-accent focus:ring-1 focus:ring-brand-accent"
            />
          ))}
        </PinInput>
      </div>

      <button
        type="submit"
        disabled={!isComplete}
        className="mt-6 w-full rounded-radius-md bg-button-primary-bg py-2.5 text-sm font-medium text-button-primary-text transition-colors duration-fast hover:bg-button-primary-hover disabled:bg-button-primary-disabled disabled:cursor-not-allowed"
      >
        Validar código
      </button>
    </form>
  )
}