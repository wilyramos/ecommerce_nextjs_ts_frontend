import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Link from "next/link";

export default function pageForgotPassword() {
    return (
        <>
        
            <h1 className='text-4xl font-bold text-center text-slate-700 mt-10'>Recuperar Contraseña</h1>
            <p className='text-center text-gray-400 pt-5'>Ingresa tu correo electrónico</p>
            
            <ForgotPasswordForm />
        
            <nav className="text-center text-sm pt-5 flex justify-between">
                <Link
                    href="/auth/login"
                    className="text-gray-800"
                >
                    ¿Ya tienes una cuenta? <span className="font-bold text-slate-500 hover:text-slate-700">Inicia sesión</span>
                </Link> 
                <Link
                    href="/auth/registro"
                    className="text-gray-800"
                >
                    ¿No tienes una cuenta? <span className="font-bold text-slate-500 hover:text-slate-700">Regístrate</span>
                </Link> 
            </nav>
            
        </>
    )
}
