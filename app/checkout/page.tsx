import ResumenCarrito from "@/components/cart/ResumenCarrito";
import ShippingForm from "@/components/checkout/ShippingForm";

export default function CheckoutPage() {
    return (
        <main className="px-20 py-6">
            <h1 className="text-xl font-bold mb-4">Finalizar Compra</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="lg:col-span-2 space-y-4">
                    <div className="">
                        <ResumenCarrito />
                    </div>

                    <div className="">
                        <h2 className="text-lg font-semibold mb-3">Información Adicional</h2>
                        <p className="text-sm text-gray-600">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                        </p>
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
