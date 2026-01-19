import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/src/auth/currentUser'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()
    if (!user) redirect("/auth/login?redirect=/checkout/profile")

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 bg-[var(--store-bg)] min-h-screen">

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