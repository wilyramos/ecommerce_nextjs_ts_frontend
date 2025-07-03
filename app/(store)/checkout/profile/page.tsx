// app/checkout/profile/page.tsx
import IdentificacionForm from '@/components/checkout/IdentificacionForm';
import { getCurrentUser } from '@/src/auth/currentUser';
import { redirect } from 'next/navigation';

export default async function ProfilePageCheckout() {

    const user = await getCurrentUser();
    if(!user) {
        redirect("/auth/login?redirect=/checkout/profile");
    }

    return (
        <div className="text-gray-800">
            <h1 className="text-xl font-semibold">Identificación</h1>
            <span className="text-md text-gray-400 text-sm font-light">
                Por favor completa tus datos personales para poder finalizar la compra
            </span>
            <IdentificacionForm user={user} /> {/* pasa el usuario al form */}
        </div>
    );
}