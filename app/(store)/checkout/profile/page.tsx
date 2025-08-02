// app/checkout/profile/page.tsx
import { FiUser } from 'react-icons/fi';
import IdentificacionForm from '@/components/checkout/IdentificacionForm';
import { getCurrentUser } from '@/src/auth/currentUser';
import { redirect } from 'next/navigation';

export default async function ProfilePageCheckout() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/auth/login?redirect=/checkout/profile");
    }

    return (
        <div className="px-4 py-6 max-w-xl mx-auto">
            <p className="flex items-center gap-2 text-gray-700 text-sm mb-4">
                <FiUser className="text-base" />
                Completa tus datos personales:
            </p>
            <IdentificacionForm user={user} />
        </div>
    );
}
