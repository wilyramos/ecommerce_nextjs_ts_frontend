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
        if (order?.payment?.status === 'pending') {
            clearCart();
            clearCheckout();
            toast.info('Tu pago está pendiente. Te avisaremos cuando se confirme.');
        }
    }, [order, clearCart, clearCheckout]);

    return (
        <div className="flex items-center justify-center px-4 py-20 bg-[var(--color-bg-primary)]">
            <div className="w-full max-w-lg bg-[var(--color-bg-tertiary)] shadow-sm rounded-3xl p-10 text-center border border-[var(--color-warning)]/20">
                <BsClockHistory className="text-[var(--color-warning)] text-7xl mx-auto mb-6" />

                <h1 className="text-3xl font-semibold text-[var(--color-text-primary)] mb-2">
                    Pago pendiente
                </h1>

                <p className="text-[var(--color-text-secondary)] text-sm mb-8 tracking-wide">
                    Estamos esperando la confirmación de tu pago. Recibirás una
                    notificación cuando se procese.
                </p>

                {/* Detalles de la orden */}
                <div className="text-left text-sm text-[var(--color-text-primary)] space-y-4 border-t border-[var(--color-border-default)] pt-6">
                    <p className="flex items-center gap-2">
                        <BsClipboardCheck className="text-[var(--color-text-tertiary)]" />
                        <span className="text-[var(--color-text-secondary)]">Número de orden:</span>
                        <span className="font-medium">{order._id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsCreditCard className="text-[var(--color-text-tertiary)]" />
                        <span className="text-[var(--color-text-secondary)]">Estado del pago:</span>
                        <span className="text-[var(--color-warning)] font-medium">
                            {order.payment?.status || 'Pendiente'}
                        </span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsFileEarmarkText className="text-[var(--color-text-tertiary)]" />
                        <span className="text-[var(--color-text-secondary)]">Total:</span>
                        <span className="font-medium">S/ {order.totalPrice.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <BsTruck className="text-[var(--color-text-tertiary)]" />
                        <span className="text-[var(--color-text-secondary)]">Envío:</span>
                        <span className="font-medium uppercase text-[var(--color-text-primary)]">
                            {order.status}
                        </span>
                    </p>
                </div>

                {/* Acciones */}
                <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/productos"
                        className="w-full sm:w-auto border border-[var(--color-border-strong)] text-[var(--color-text-primary)] py-2.5 px-6 rounded-full text-sm tracking-wide hover:bg-[var(--color-surface-hover)] transition flex items-center justify-center gap-2"
                    >
                        <FiArrowLeftCircle className="text-lg" />
                        Seguir comprando
                    </Link>
                    <Link
                        href="/profile/orders"
                        className="w-full sm:w-auto bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] py-2.5 px-6 rounded-full text-sm tracking-wide hover:opacity-90 transition flex items-center justify-center gap-2"
                    >
                        <BsClipboardCheck className="text-lg" />
                        Ver mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}