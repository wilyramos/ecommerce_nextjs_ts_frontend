// File: frontend/components/checkout/SuccessClient.tsx
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { OrderResponse } from '@/src/schemas/order.schema';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, CreditCard, Receipt, Truck, ArrowLeft } from 'lucide-react';

interface Props {
    order: OrderResponse;
}

export default function SuccessClient({ order }: Props) {
    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

    useEffect(() => {
        // Vaciado automático inmediato de la memoria del cliente (Mecanismo anti-duplicación)
        clearCart();
        clearCheckout();
    }, [clearCart, clearCheckout, order.status, order.payment?.status]);

    const isPaid = order.payment?.status === 'approved' || order.status === 'processing' || order.status === 'shipped';

    return (
        <div className="flex items-center justify-center px-4 py-16 bg-background text-foreground">
            <div className="w-full max-w-lg p-8 md:p-10 text-center bg-card rounded-[var(--radius-lg)] border border-border shadow-xs">
                <CheckCircle2 className="text-success w-16 h-16 mx-auto mb-5" />

                <h1 className="text-xl font-black text-foreground mb-1.5 flex items-center justify-center gap-2 uppercase tracking-wide select-none">
                    <ShoppingBag className="text-action-cta w-5 h-5 shrink-0" />
                    {isPaid ? "¡Pago Confirmado!" : "Pedido Recibido"}
                </h1>

                <p className="text-muted-foreground text-xs font-semibold mb-6 tracking-normal max-w-sm mx-auto">
                    {isPaid
                        ? "Tu pago fue aprobado con éxito. Tu orden ya está en preparación."
                        : "Tu pedido está registrado y se encuentra en verificación de pago."}
                </p>

                {/* Grid de metadata estructurada estilo recibo comercial */}
                <div className="text-left text-xs text-foreground space-y-3.5 border-t border-border pt-6 font-semibold">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <span className="text-muted-foreground flex items-center gap-2 select-none">
                            <Receipt className="w-3.5 h-3.5 shrink-0" /> Código de compra:
                        </span>
                        <span className="font-mono font-bold text-foreground select-all">{order.orderNumber}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <span className="text-muted-foreground flex items-center gap-2 select-none">
                            <CreditCard className="w-3.5 h-3.5 shrink-0" /> Estado del pago:
                        </span>
                        <span className={`font-black uppercase tracking-wider text-[11px] ${isPaid ? "text-success" : "text-warning"}`}>
                            {order.payment?.status || "Awaiting"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <span className="text-muted-foreground flex items-center gap-2 select-none">
                            <ShoppingBag className="w-3.5 h-3.5 shrink-0" /> Monto debitado:
                        </span>
                        <span className="font-mono font-bold text-foreground select-all">{order.currency} {order.totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between pb-1">
                        <span className="text-muted-foreground flex items-center gap-2 select-none">
                            <Truck className="w-3.5 h-3.5 shrink-0" /> Flujo logístico:
                        </span>
                        <span className="font-bold text-foreground uppercase tracking-wider bg-background-secondary px-2 py-0.5 rounded-[var(--radius-sm)] border border-border text-[10px]">
                            {order.status.replace("_", " ")}
                        </span>
                    </div>
                </div>

                {/* Acciones del Core */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center select-none">
                    <Link
                        href="/productos"
                        className="w-full sm:w-auto border border-border text-foreground py-2.5 px-6 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider hover:bg-background-secondary transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Regresar al catálogo
                    </Link>
                    <Link
                        href="/profile/orders"
                        className="w-full sm:w-auto bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground py-2.5 px-6 rounded-[var(--radius-sm)] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Monitorear mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    );
}