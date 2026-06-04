// File: frontend/components/checkout/culqi/ComponentScriptCulqiCustom.tsx

"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { processPaymentCulqi } from "@/actions/checkout/process-culqi-payment";
import type { TOrderPopulated } from "@/src/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


interface CulqiToken {
    id: string;
    email: string;
    last_four: string;
}

interface CulqiOrder {
    id: string;
}

interface CulqiError {
    user_message: string;
    merchant_message: string;
    code: string;
}

interface CulqiInstance {
    token?: CulqiToken | null;
    order?: CulqiOrder | null;
    error?: CulqiError | null;
    culqi: () => void;
    open: () => void;
    close: () => void;
}




export default function ComponentScriptCulqiCustom({ order }: { order: TOrderPopulated }) {
    const [culqiReady, setCulqiReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkoutRef = useRef<CulqiInstance | null>(null);

    // Ref espejo de la orden — siempre actualizado sin recrear callbacks
    const orderRef = useRef(order);
    useEffect(() => { orderRef.current = order; }, [order]);

    // Handler principal manejado mediante Ref
    const paymentHandlerRef = useRef<() => Promise<void>>(async () => { });

    paymentHandlerRef.current = async () => {
        const Culqi = checkoutRef.current;
        if (!Culqi) {
            return;
        }

        if (Culqi.error) {
            toast.error(Culqi.error.user_message);
            return;
        }

        const currentOrder = orderRef.current;

        // Culqi requiere el monto en céntimos enteros (Ej: S/. 10.50 -> 1050)
        const amount = Math.round(currentOrder.totalPrice * 100);
        const orderId = String(currentOrder._id);
        const userEmail = currentOrder.user?.email || "correo@temporal.com";

        setLoading(true);

        try {
            if (Culqi.token) {
                // ── Pago con Tarjeta ───────────────────────────────────────────
                await processPaymentCulqi({
                    token: Culqi.token.id,
                    email: Culqi.token.email || userEmail,
                    amount,
                    orderId,
                });

                Culqi.close();
                router.push(`/checkout-result/success?orderId=${orderId}`);

            } else if (Culqi.order) {
                // ── Pago con Billeteras / Yape ───────────────────────────────
                await processPaymentCulqi({
                    order: Culqi.order.id,
                    email: userEmail,
                    amount,
                    orderId,
                });

                Culqi.close();
                router.push(`/checkout-result/success?orderId=${orderId}`);
            }

        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error procesando el pago.");
        } finally {
            setLoading(false);
        }
    };

    // ── Inicialización de la pasarela ─────────────────────────────────────────
    const initCheckout = () => {
        const pk = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
        const currentOrder = orderRef.current;

        if (!pk || !window.CulqiCheckout) return;

        // Convertimos el total del modelo a céntimos y usamos su moneda (PEN / USD)
        const amount = Math.round(currentOrder.totalPrice * 100);

        const instance = new window.CulqiCheckout(pk, {
            settings: {
                title: "GOPHONE",
                currency: currentOrder.currency || "PEN",
                amount: amount,
            },
            options: {
                lang: "auto",
                installments: true,
                modal: true,
                paymentMethods: {
                    tarjeta: true,
                    yape: true,
                    billetera: true,
                    bancaMovil: true,
                    agente: true,
                    cuotealo: false,
                },
                paymentMethodsSort: ["tarjeta", "yape", "billetera"],
            },
        });

        instance.culqi = () => {
            paymentHandlerRef.current();
        };

        checkoutRef.current = instance;
        setCulqiReady(true);
    };

    const handleScriptLoad = () => {
        if (window.CulqiCheckout) {
            initCheckout();
            return;
        }

        const interval = setInterval(() => {
            if (window.CulqiCheckout) {
                clearInterval(interval);
                initCheckout();
            }
        }, 100);

        setTimeout(() => clearInterval(interval), 5000);
    };

    const openCheckout = () => {
        if (!checkoutRef.current || loading) return;
        checkoutRef.current.open();
    };

    return (
        <>
            <Script
                src="https://js.culqi.com/checkout-js"
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
                onError={(e) => console.error("❌ [Culqi] Error al cargar script:", e)}
            />

            <button
                type="button"
                onClick={openCheckout}
                disabled={!culqiReady || loading}
                className={`w-full py-3 px-6 rounded-[var(--radius-sm)] border font-bold transition-all select-none cursor-pointer outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring
                    ${culqiReady && !loading
                        ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                        : "bg-background-secondary text-muted-foreground border-border cursor-not-allowed opacity-50"
                    }`}
            >

                de prueba testt
                {loading
                    ? "Procesando pago..."
                    : culqiReady
                        ? `Pagar ${order.currency} ${order.totalPrice.toFixed(2)}`
                        : "Cargando pasarela..."}
            </button>
        </>
    );
}