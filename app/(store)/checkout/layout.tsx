import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito';
import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';


export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {

    const { user } = await verifySession();
    if (!user) {
        // Si no hay usuario, redirigir a la página de inicio de sesión
        redirect('/login');
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

            {/* Pasos del checkout */}
            <div className=" ">
                <CheckoutSteps />
            </div>

            {/* Grid: paso actual + resumen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 min-h-screen">

                {/* Paso actual (shipping, payment, etc.) */}
                <section className="lg:col-span-2 space-y-8">
                    {children}
                </section>

                {/* Resumen persistente */}
                <aside className="sticky top-24 h-fit">
                    <ResumenFinalCarrito />
                </aside>

            </div>
        </main>
    );
}