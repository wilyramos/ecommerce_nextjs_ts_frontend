import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function pageForgotPassword() {
    return (
        <div className="w-full max-w-md border p-6 rounded-3xl">
            <h1 className="text-3xl font-semibold text-center">Recuperar Contraseña</h1>
            <p className="text-gray-600  py-2">Ingresa tu correo electrónico para recibir el enlace</p>

            <ForgotPasswordForm />

            <nav className="text-sm text-gray-600 mt-4 text-center space-y-2">
                <p>
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        href="/auth/login"
                        className="text-indigo-800 font-black hover:underline"
                    >
                        Inicia sesión
                    </Link>
                </p>
                <p>
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/auth/registro"
                        className="text-indigo-800 font-black hover:underline"
                    >
                        Regístrate
                    </Link>
                </p>
            </nav>
        </div>
    );
}
