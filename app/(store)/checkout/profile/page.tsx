import { FiUser } from "react-icons/fi";
import IdentificacionForm from "@/components/checkout/IdentificacionForm";
import { getCurrentUser } from "@/src/auth/currentUser";
import { redirect } from "next/navigation";

export default async function ProfilePageCheckout() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login?redirect=/checkout/profile");

    return (
        <div className="max-w-2xl mx-auto bg-[var(--color-bg-primary)] p-6 md:p-10 border border-[var(--color-border-subtle)]">
            <header className="flex flex-col gap-1 mb-8 pb-6 border-b border-[var(--color-border-subtle)]">
                {/* Label minimalista */}
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                    Paso 01
                </span>
                
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-primary)]">
                        <FiUser size={16} strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-accent-warm)]">
                        Información personal
                    </h2>
                </div>
            </header>
            
            <IdentificacionForm user={user} />
        </div>
    );
}