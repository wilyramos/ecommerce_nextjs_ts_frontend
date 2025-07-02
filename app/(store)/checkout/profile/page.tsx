// app/checkout/profile/page.tsx
import IdentificacionForm from '@/components/checkout/IdentificacionForm';
import { getCurrentUser } from '@/src/auth/currentUser';

export default async function ProfilePageCheckout() {

    // Obtener el usuario actual 
    const user = await getCurrentUser();
    console.log("Usuario actual:", user);

    return (
        <div className="text-gray-800 text-sm">
            <h1 className="text-xl font-semibold">Identificación</h1>
            <span className="text-md text-gray-400">
                Por favor completa tus datos personales para poder finalizar la compra
            </span>
            <IdentificacionForm user={user} /> {/* pasa el usuario al form */}
        </div>
    );
}