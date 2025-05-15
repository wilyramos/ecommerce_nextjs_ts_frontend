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

            <h1 className="text-3xl font-bold text-center text-gray-800">Crea tu cuenta</h1>
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