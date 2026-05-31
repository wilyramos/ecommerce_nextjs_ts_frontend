// File: frontend/app/checkout/profile/page.tsx

import { FiUser } from "react-icons/fi";
import IdentificacionForm from "@/components/checkout/IdentificacionForm";
import { getCurrentUser } from "@/src/auth/currentUser";
import { redirect } from "next/navigation";
import { Muted, H2 } from "@/components/ui/Typography";

export default async function ProfilePageCheckout() {
    const user = await getCurrentUser();
    if (!user) redirect("/auth/login?redirect=/checkout/profile");

    return (
        <div className="max-w-2xl mx-auto bg-card p-6 md:p-10 border border-border rounded-[var(--radius-lg)] text-card-foreground shadow-xs">
            <header className="flex flex-col gap-1.5 mb-8 pb-6 border-b border-border select-none">
                <Muted className="text-[9px] font-bold uppercase tracking-[0.2em]">
                    Paso 01
                </Muted>
                
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-foreground border border-border">
                        <FiUser size={16} strokeWidth={2} />
                    </div>
                    <H2>
                        Información personal
                    </H2>
                </div>
            </header>
            
            <IdentificacionForm user={user} />
        </div>
    );
}