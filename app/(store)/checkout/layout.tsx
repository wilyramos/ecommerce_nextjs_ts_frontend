// File: frontend/app/(store)/checkout/layout.tsx

import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito'
import { redirect } from 'next/navigation'
import { getSession } from '@/src/auth/dal'; // Importa getSession en lugar de verifySessionimport { headers } from 'next/headers';
import { headers } from "next/headers";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession(); // No lanza redirect automático
    
    if (!session) {
        const headersList = await headers();
        const pathname = headersList.get("x-invoke-path") || "/checkout/profile";
        redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 min-h-screen bg-background text-foreground">

            {/* Contenedor de Pasos Centrado */}
            <div className="mb-6 md:mb-8 flex justify-center w-full">
                <CheckoutSteps />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sección Principal (Formularios) */}
                <section className="lg:col-span-2">
                    {children}
                </section>

                {/* Resumen Lateral (Sticky) */}
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-8">
                        <ResumenFinalCarrito />
                    </div>
                </aside>

            </div>
        </main>
    )
}