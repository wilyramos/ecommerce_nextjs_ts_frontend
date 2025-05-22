import PaymentForm from "@/components/cart/PaymentForm";

export default function PaymentPage() {
    return (
        <>
            <main className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row md:space-x-12">
                {/* Sección principal: Detalles del Pago */}
                <section className="flex-1 mb-8 md:mb-0">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">Datos de pago y confirmación</h1>
                    <p className="text-gray-600 mb-6">
                        Introduce tus detalles de pago para completar tu compra.
                    </p>

                    {/* Formulario de Pago */}
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                Número de tarjeta
                            </label>
                            <input
                                type="text"
                                id="cardNumber"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1234 5678 9012 3456"
                                aria-label="Número de tarjeta"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                    Fecha de expiración
                                </label>
                                <input
                                    type="text"
                                    id="expiryDate"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="MM/AA"
                                    aria-label="Fecha de expiración"
                                    required
                                />
                            </div>
                            <div className="w-24">
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    id="cvv"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="123"
                                    aria-label="CVV"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md py-3 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                            >
                                Pagar Ahora
                            </button>
                        </div>
                    </form>
                </section>

                {/* Sección de Resumen de la Compra */}
                <aside className="w-full md:w-96">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900">Resumen de tu pedido</h2>
                    <div className="bg-gray-100 rounded-md p-4">
                        <ul className="text-gray-600 space-y-2 mb-4">
                            <li>Producto 1: <span className="font-semibold">S/. 100.00</span></li>
                            <li>Producto 2: <span className="font-semibold">S/. 200.00</span></li>
                            <li>Producto 3: <span className="font-semibold">S/. 300.00</span></li>
                        </ul>
                        <div className="border-t border-gray-200 pt-4 mb-2">
                            <div className="flex justify-between text-gray-700 mb-2">
                                <span>Subtotal:</span>
                                <span className="font-semibold">S/. 600.00</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Envío:</span>
                                <span className="font-semibold">S/. 20.00</span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-xl font-semibold text-gray-900">
                                <span>Total:</span>
                                <span>S/. 620.00</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
            <PaymentForm />
        </>

    );
}