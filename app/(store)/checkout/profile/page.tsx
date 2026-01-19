import { FiUser } from "react-icons/fi";
import IdentificacionForm from "@/components/checkout/IdentificacionForm";
import { getCurrentUser } from "@/src/auth/currentUser";
import { redirect } from "next/navigation";

export default async function ProfilePageCheckout() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login?redirect=/checkout/profile");

    return (
        <div className="max-w-2xl mx-auto bg-[var(--store-surface)] p-6 md:p-8 rounded-2xl border border-[var(--store-border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--store-border)]">
                <div className="w-8 h-8 rounded-full bg-[var(--store-bg)] flex items-center justify-center text-[var(--store-text)]">
                    <FiUser size={18} />
                </div>
                <h2 className="text-lg font-semibold text-[var(--store-text)]">
                    Información personal
                </h2>
            </div>
            
            <IdentificacionForm user={user} />
        </div>
    );
}