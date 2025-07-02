import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";



export const metadata: Metadata = {
    title: "GoPhone Cañete - Registro de cuenta",
    description: "GoPhone Cañete - Registro de cuenta",
    keywords: "registro, GoPhone Cañete, cuenta",
};

export default function PageRegistro() {
    return (
        <div className="w-full max-w-md border p-6 rounded-3xl" >

            <h1 className="text-3xl font-semibold text-center">Crea tu cuenta</h1>
            <p className="text-gray-600 text-center">Completa el formulario para registrarte</p>


            <RegisterForm />

            <nav className="text-sm text-gray-600 mt-4 text-center">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/auth/login"
                        className="text-indigo-800 font-black hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </nav>
        </div>
    );
}
