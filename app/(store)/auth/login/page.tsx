import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'GoPhone Cañete - Iniciar Sesión',
    description: 'GoPhone Cañete - Iniciar Sesión',
    keywords: 'iniciar sesión, GoPhone Cañete, cuenta',
}

export default function PageLogin() {
    return (
        <div className="w-full max-w-xs mx-auto">
            <h1 className="text-3xl font-semibold text-center">Iniciar sesión</h1>
            <p className="text-gray-600 text-center">Ingresa tus credenciales para continuar</p>

            <LoginForm />

            
        </div>
    )
}
