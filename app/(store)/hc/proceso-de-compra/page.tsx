import {
    ShoppingCart,
    CreditCard,
    CheckCircle2,
    Package,
    Truck,
    ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ProcesoCompraPage() {
    return (
        <section className="max-w-5xl mx-auto px-4 space-y-8">

            {/* Título */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Proceso de Compra
            </h1>

            {/* Intro */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Comprar en <b>Gophone</b> es rápido, seguro y sencillo. A continuación te
                    explicamos paso a paso cómo realizar tu pedido.
                </p>
            </div>

            {/* Paso 1 */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    1. Elige tus productos
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Navega por nuestras categorías, revisa características, variantes
                    disponibles y agrega al carrito los productos que deseas comprar.
                </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-700" />
                    2. Métodos de pago disponibles
                </h2>

                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Visa</li>
                    <li>Mastercard</li>
                    <li>American Express</li>
                    <li>Mercado Pago</li>
                    <li>Yape</li>
                </ul>

                <p className="text-xs text-gray-500 italic">
                    *Todos los pagos son procesados de manera segura.
                </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gray-700" />
                    3. Confirmación del pedido
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Una vez realizado el pago, recibirás un correo con la confirmación de tu pedido
                    y los detalles del mismo. Si usaste WhatsApp, también podemos confirmarlo por ahí.
                </p>
            </div>

            {/* Paso 4 */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-700" />
                    4. Preparación del producto
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Nuestro equipo prepara cuidadosamente tu pedido para garantizar que llegue
                    en perfectas condiciones. Todos los productos se verifican antes del envío.
                </p>
            </div>

            {/* Paso 5 */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-700" />
                    5. Envíos y tiempos de entrega
                </h2>

                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Envíos a nivel nacional</li>
                    <li>Entrega rápida en Cañete</li>
                    <li>Courier seguro según destino</li>
                </ul>

                <p className="text-xs text-gray-500 italic">
                    *Los tiempos varían según tu localidad. Consulta por disponibilidad inmediata.
                </p>
            </div>

            {/* Recomendación */}
            <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">
                <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gray-700" />
                    Recomendación importante
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Revisa tu producto apenas lo recibas y conserva la boleta o factura de compra,
                    ya que es necesaria para validar cualquier garantía o cambio.
                </p>
            </div>

            <p className="text-[11px] text-gray-400 italic text-center">
                Gracias por confiar en Gophone.
            </p>

            {/* Botón volver */}
            <div className="text-center mt-6">
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                    Volver al inicio
                </Link>
            </div>

        </section>
    );
}
