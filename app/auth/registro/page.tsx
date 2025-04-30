import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";


// SEO metadata for the page
export const metadata: Metadata = {
    title: "Ecommerce - Registro de cuenta",
    description: "Ecommerce - Registro de cuenta",
    keywords: "registro, ecommerce, cuenta",
};

export default function pageRegistro() {
    return (
        <div className="flex justify-center flex-col ">
            <h1 className='text-4xl font-bold text-center text-slate-700 mt-10'>
                Ecommerce</h1>
            <p className='text-center text-gray-400 pt-5'>Crea tu cuenta</p>

            <RegisterForm />

            <nav className="text-center text-sm pt-5">
                <Link
                    href="/auth/login"
                    className="text-gray-800"
                >
                    ¿Ya tienes una cuenta? <span className="font-bold text-slate-500 hover:text-slate-700">Inicia Sesion</span>
                </Link>
            </nav>

        </div>
    )
}
