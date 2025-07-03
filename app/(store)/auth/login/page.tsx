import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'GoPhone Cañete - Iniciar Sesión',
    description: 'GoPhone Cañete - Iniciar Sesión',
    keywords: 'iniciar sesión, GoPhone Cañete, cuenta',
}

export default function PageLogin() {
    return (
        <div className="w-full max-w-sm">
            <h1 className="text-3xl font-semibold text-center">Iniciar sesión</h1>
            <p className="text-gray-600 text-center">Ingresa tus credenciales para continuar</p>

            <LoginForm />

            <nav className="text-sm text-gray-600 mt-4 text-center space-y-2 pt-10">
                <p>
                    ¿No tienes una cuenta?{' '}
                    <Link
                        href="/auth/registro"
                        className="text-blue-800 font-black hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
                <p>
                    ¿Olvidaste tu contraseña?{' '}
                    <Link
                        href="/auth/forgot-password"
                        className="text-blue-800 font-black hover:underline"
                    >
                        Recuperar acceso
                    </Link>
                </p>
            </nav>
        </div>
    )
}
