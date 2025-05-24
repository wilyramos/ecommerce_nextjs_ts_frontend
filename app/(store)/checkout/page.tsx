import ResumenCarrito from "@/components/cart/ResumenCarrito";
import ShippingForm from "@/components/checkout/ShippingForm";

export default function CheckoutPage() {

    
    return (
        <main className="max-w-6xl mx-auto px-10 py-5">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Finalizar Compra</h2>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 space-y-4">
                    <div className="">
                        <ResumenCarrito />
                    </div>
                    
                </section>

                <aside className="lg:col-span-1 space-y-4">
                    <div className="">
                        <h2 className="text-lg font-semibold mb-3">Detalles de Envío</h2>
                        <ShippingForm />
                    </div>
                </aside>
            </div>
        </main>
    );
}
