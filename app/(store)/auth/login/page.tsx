import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
    title: 'GoPhone - Iniciar Sesión',
    description: 'GoPhone - Iniciar Sesión',
    keywords: 'iniciar sesión, GoPhone Cañete, cuenta',
}

export default function PageLogin() {
    return (
        <div className="w-full max-w-xs mx-auto">
            <h1 className="text-2xl text-center">Iniciar sesión</h1>
            <LoginForm />
        </div>
    )
}
