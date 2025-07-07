
import Link from "next/link";
import { FiAlertCircle, FiShoppingCart, FiHome } from "react-icons/fi";


type ErrorClientProps = {
    errorMessage?: string;
    orderId?: string;
};

export default function ErrorClient({ errorMessage, orderId }: ErrorClientProps) {
    return (

        <div className="flex items-center justify-center px-4 p-20 min-h-screen bg-gray-50">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-10 text-center border border-red-200">
                <FiAlertCircle className="text-red-500 text-7xl mx-auto mb-6 animate-pulse" /> {/* Pulsing animation for attention */}
                <h1 className="text-3xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    ¡Algo salió mal!
                </h1>
                <p className="text-gray-600 text-sm mb-8 tracking-wide">
                    {errorMessage || 'No pudimos procesar tu pago o hubo un problema con tu orden.'}
                    <br />
                    Por favor, revisa los detalles e intenta nuevamente.
                </p>

                {orderId && (
                    <p className="text-left text-sm text-gray-700 mb-6">
                        <span className="font-medium">ID de Orden (si aplica):</span> {orderId}
                    </p>
                )}

                {/* Acciones */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/carrito"
                        className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-full text-sm font-medium tracking-wide hover:bg-red-600 transition flex items-center justify-center gap-2 shadow-md"
                    >
                        <FiShoppingCart className="text-lg" />
                        Volver al Carrito
                    </Link>
                    <Link
                        href="/"
                        className="w-full sm:w-auto border border-gray-300 text-gray-800 py-2 px-6 rounded-full text-sm tracking-wide hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                        <FiHome className="text-lg" />
                        Ir a la Página Principal
                    </Link>
                </div>

                <div className="mt-8 text-xs text-gray-500">
                    Si el problema persiste, por favor, <a href="mailto:soporte@gophone.pe" className="text-blue-600 hover:underline">contacta a soporte</a>.
                    O puedes contactar a nuestro whatsapp al <a href="https://wa.me/51907103353" className="text-blue-600 hover:underline">+51 907103353</a>.
                </div>
            </div>
        </div>
    );
}