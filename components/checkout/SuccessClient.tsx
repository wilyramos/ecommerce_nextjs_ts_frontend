'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { Order } from '@/src/schemas';
import { toast } from 'sonner';
import Link from 'next/link';

import { BsCheckCircle, BsTruck, BsFileEarmarkText, BsCreditCard, BsClipboardCheck, BsBagCheck } from 'react-icons/bs';
import { FiArrowLeftCircle, FiPackage } from 'react-icons/fi';

export default function SuccessClient({ order }: { order: Order }) {
    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

    useEffect(() => {
        if (order?.paymentStatus === 'PAGADO') {
            clearCart();
            clearCheckout();
            toast.success('¡Pago exitoso! Tu orden ha sido procesada correctamente.');
        }
    }, [order, clearCart, clearCheckout]);

    return (
        <div className="flex items-center justify-center px-4 p-20">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-10 text-center">
                <BsCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
                <h1 className="text-3xl font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <BsBagCheck className="text-blue-600" />
                    Pago aprobado
                </h1>
                <p className="text-gray-500 text-sm mb-8 tracking-wide">
                    Tu orden está en proceso. Gracias por confiar en nosotros.
                </p>

                {/* Detalles con íconos */}
                <div className="text-left text-sm text-gray-700 space-y-4 border-t pt-6">
                    <p className="flex items-center gap-2">
                        <BsClipboardCheck className="text-gray-400" />
                        <span className="text-gray-500">Número de orden:</span>
                        <span className="font-medium">{order._id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsCreditCard className="text-gray-400" />
                        <span className="text-gray-500">Estado del pago:</span>
                        <span className="text-green-600 font-medium">{order.paymentStatus}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsFileEarmarkText className="text-gray-400" />
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium">s/{order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsTruck className="text-gray-400" />
                        <span className="text-gray-500">Envío:</span>
                        <span className="font-medium">{order.shippingMethod}</span>
                    </p>
                    {order.notes && (
                        <p className="flex items-center gap-2">
                            <FiPackage className="text-gray-400" />
                            <span className="text-gray-500">Notas:</span>
                            <span className="font-medium">{order.notes}</span>
                        </p>
                    )}
                </div>

                {/* Acciones */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href={`/productos`}
                        className="w-full sm:w-auto border border-gray-300 text-gray-800 py-2 px-6 rounded-full text-sm tracking-wide hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                        <FiArrowLeftCircle className="text-lg" />
                        Seguir comprando
                    </Link>
                    <Link
                        href="/profile/orders"
                        className="w-full sm:w-auto border border-gray-300 text-gray-800 py-2 px-6 rounded-full text-sm tracking-wide hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                        <BsClipboardCheck className="text-lg" />
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}
