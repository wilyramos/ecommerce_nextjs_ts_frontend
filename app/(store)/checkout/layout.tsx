import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/src/auth/currentUser'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser()
    if (!user) redirect("/auth/login?redirect=/checkout/profile")

    return (
        <main className="max-w-6xl mx-auto px-3 sm:px-4">

            <div className="mb-2">
                <CheckoutSteps />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                
                <section className="md:col-span-2">
                    {children}
                </section>

                <aside
                    className="
                        mt-4
                        md:mt-0
                        lg:col-span-1
                        lg:ml-8
                        lg:sticky
                        lg:top-20
                    "
                >
                    <ResumenFinalCarrito />
                </aside>

            </div>
        </main>
    )
}
