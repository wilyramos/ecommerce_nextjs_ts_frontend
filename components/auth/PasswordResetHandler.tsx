"use client"

import { useEffect, useState } from "react"
import ResetPasswordForm from "./ResetPasswordForm"
import { useSearchParams } from "next/navigation"
import { P } from "@/components/ui/TypographyV3"

export default function PasswordResetHandler() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tokenFromURL = searchParams.get("token")
    setToken(tokenFromURL)
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="my-8 text-center">
        <P className="animate-pulse text-text-tertiary">Verificando enlace...</P>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="my-8 text-center">
        <P className="text-status-error font-medium">El enlace de recuperación es inválido o expiró.</P>
      </div>
    )
  }

  return <ResetPasswordForm token={token} />
}