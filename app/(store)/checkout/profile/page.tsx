// app/checkout/profile/page.tsx
import { FiUser } from "react-icons/fi";
import IdentificacionForm from "@/components/checkout/IdentificacionForm";
import { getCurrentUser } from "@/src/auth/currentUser";
import { redirect } from "next/navigation";

export default async function ProfilePageCheckout() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login?redirect=/checkout/profile");

    return (
        <div className="max-w-xl mx-auto">
            <p className="flex items-center gap-2 text-sm text-black mb-4">
                <FiUser /> Mi información personal:
            </p>
            <IdentificacionForm user={user} />
        </div>
    );
}
