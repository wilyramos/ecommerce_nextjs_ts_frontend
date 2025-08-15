'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { TOrderPopulated } from '@/src/schemas';
import { toast } from 'sonner';
import Link from 'next/link';

import {
    BsClockHistory,
    BsCreditCard,
    BsClipboardCheck,
    BsTruck,
    BsFileEarmarkText,
} from 'react-icons/bs';
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function PendingClient({ order }: { order: TOrderPopulated }) {
    
    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);


    useEffect(() => {
        if (order?.payment.status === 'pending') {
            clearCart();
            clearCheckout();
            toast.info('Tu pago está pendiente. Te avisaremos cuando se confirme.');
        }
    }, [order, clearCart, clearCheckout]);

    return (
        <div className="flex items-center justify-center px-4 p-20">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-10 text-center">
                <BsClockHistory className="text-yellow-500 text-7xl mx-auto mb-6" />
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    Pago pendiente
                </h1>
                <p className="text-gray-500 text-sm mb-8 tracking-wide">
                    Estamos esperando la confirmación de tu pago. Recibirás una
                    notificación cuando se procese.
                </p>

                {/* Detalles de la orden */}
                <div className="text-left text-sm text-gray-700 space-y-4 border-t pt-6">
                    <p className="flex items-center gap-2">
                        <BsClipboardCheck className="text-gray-400" />
                        <span className="text-gray-500">Número de orden:</span>
                        <span className="font-medium">{order._id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsCreditCard className="text-gray-400" />
                        <span className="text-gray-500">Estado del pago:</span>
                        <span className="text-yellow-500 font-medium">
                            {order.status}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsFileEarmarkText className="text-gray-400" />
                        <span className="text-gray-500">Total:</span>
                        <span className="font-medium">s/{order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsTruck className="text-gray-400" />
                        <span className="text-gray-500">Envío:</span>
                    </p>
                </div>

                {/* Acciones */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/productos"
                        className="w-full sm:w-auto border border-gray-300 text-gray-800 py-2 px-6 rounded-full text-sm tracking-wide hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                        <FiArrowLeftCircle className="text-lg" />
                        Seguir comprando
                    </Link>
                    <Link
                        href="/profile/mis-pedidos"
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