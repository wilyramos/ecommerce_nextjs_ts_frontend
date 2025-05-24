import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Store Cañete - Registro de cuenta",
    description: "Store Cañete - Registro de cuenta",
    keywords: "registro, Store Cañete, cuenta",
};

export default function PageRegistro() {
    return (
        <main className="flex items-center justify-center">
            <div className="w-full max-w-md space-y-2 p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-slate-800">Crea tu cuenta</h1>
                    <p className="text-gray-500 mt-2">Completa el formulario para registrarte</p>
                </div>

                <RegisterForm />

                <nav className="text-sm text-gray-600 mt-4 text-center">
                    <p>
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-slate-800 hover:underline"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </nav>
            </div>
        </main>
    );
}
