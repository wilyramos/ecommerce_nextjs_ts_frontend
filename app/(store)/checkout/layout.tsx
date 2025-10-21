import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/auth/currentUser';


export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {

    const user = await getCurrentUser();
    if (!user) redirect("/auth/login?redirect=/checkout/profile");

    return (
        <main className="max-w-6xl mx-auto">

            {/* Pasos del checkout */}
            <div className=" ">
                <CheckoutSteps />
            </div>

            {/* Grid: paso actual + resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                {/* Paso actual (shipping, payment, etc.) */}
                <section className="md:col-span-2 px-4">
                    {children}
                </section>

                {/* Resumen persistente */}
                <aside className="sticky top-20 self-start lg:col-span-1 lg:ml-8 mt-10 md:mt-0">
                    <ResumenFinalCarrito />
                </aside>

            </div>
        </main>
    );
}