import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function pageRegistro() {
    return (
        <>
            <h1 className='text-6xl font-bold text-center'>Register</h1>
            <p className='text-center text-gray-400'>Crea tu cuenta</p>
            <p className='text-center text-gray-400'>Es gratis
                y solo te tomara un minuto</p>

            <RegisterForm />

            <nav className="mt-5 text-center space-y-4">
                <Link
                    href="/auth/login"
                    className="text-gray-400"
                >
                    ¿Ya tienes una cuenta? <span className="font-bold text-gray-300">Inicia Sesion</span>
                </Link>
            </nav>

            <nav className="mt-5 text-center space-y-4">
                <Link
                    href="/auth/forgot-password"
                    className="text-gray-400"
                >
                    ¿Olvidaste tu contraseña? <span className="font-bold text-gray-300">Recuperala</span>
                </Link>
            </nav>

        </>
    )
}
