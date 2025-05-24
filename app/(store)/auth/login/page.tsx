import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'Store Cañete - Iniciar Sesión',
    description: 'Store Cañete - Iniciar Sesión',
    keywords: 'iniciar sesión, Store Cañete, cuenta',
}

export default function PageLogin() {
    return (
        <main className="flex items-center justify-center ">
            <div className="w-full max-w-md space-y-8 p-8 bg-white">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-slate-800">Iniciar Sesión</h1>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
                </div>

                <LoginForm />

                <div className="text-sm text-gray-600 mt-4 space-y-2">
                    <p className="text-center">
                        ¿No tienes una cuenta?{' '}
                        <Link
                            href="/auth/registro"
                            className="font-medium text-slate-800 hover:underline"
                        >
                            Regístrate
                        </Link>
                    </p>
                    <p className="text-center">
                        ¿Olvidaste tu contraseña?{' '}
                        <Link
                            href="/auth/forgot-password"
                            className="font-medium text-slate-800 hover:underline"
                        >
                            Recuperar acceso
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}
