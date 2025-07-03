import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";



export const metadata: Metadata = {
    title: "GoPhone Cañete - Registro de cuenta",
    description: "GoPhone Cañete - Registro de cuenta",
    keywords: "registro, GoPhone Cañete, cuenta",
};

export default function PageRegistro() {

    return (
        <div className="w-full max-w-xs mx-auto">

            <h1 className="text-3xl font-semibold text-center">Crea tu cuenta</h1>
            <p className="text-gray-600 text-center">Completa el formulario para registrarte</p>


            <RegisterForm 
                // redirectTo={redirectTo} // Pasar el redirectTo al formulario
            />

            
        </div>
    );
}
