
import ResumenCarrito from "@/components/cart/ResumenCarrito"
import ButtonProceedToPayment from "@/components/ui/ButtonProceedToPayment"

export default function CheckoutPage() {
    return (
        <main className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row md:space-x-12">

            {/* Sección principal: carrito */}
            <section className="flex-1 mb-8 md:mb-0">
                <h1 className="text-3xl font-bold mb-3 text-gray-900">Checkout</h1>
                <p className="text-gray-600 mb-6">
                    Por favor, revisa tu carrito antes de proceder al pago.
                </p>
                <ResumenCarrito />
            </section>

            {/* Resumen de compra */}
            <aside className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>
                <p className="text-gray-600 mb-4">
                    Asegúrate de que todo esté correcto antes de continuar.
                </p>
                <ButtonProceedToPayment />
            </aside>
            
        </main>
    )
}
