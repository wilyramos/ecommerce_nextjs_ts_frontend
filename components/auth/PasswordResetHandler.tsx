'use client'

import { useEffect, useState } from 'react'
import ResetPasswordForm from './ResetPasswordForm'
import { useSearchParams } from 'next/navigation'

export default function PasswordResetHandler() {
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tokenFromURL = searchParams.get('token')
    setToken(tokenFromURL)
    setIsLoading(false) // Ya cargó la info
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-gray-400 animate-pulse">Cargando...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="text-center text-white mt-10">
        <p className="text-gray-400">No se proporcionó un token válido en la URL.</p>
      </div>
    )
  }

  return <ResetPasswordForm token={token} />
}
