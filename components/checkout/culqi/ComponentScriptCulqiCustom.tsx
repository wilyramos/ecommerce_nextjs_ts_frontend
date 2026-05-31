"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { processPaymentCulqi } from "@/actions/checkout/process-culqi-payment";
import type { TOrderPopulated } from "@/src/schemas";

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

interface CulqiCheckoutConfig {
    settings: {
        title: string;
        currency: string;
        amount: number;
    };
    options: {
        lang: string;
        installments: boolean;
        modal: boolean;
        paymentMethods: {
            tarjeta: boolean;
            yape: boolean;
            billetera: boolean;
            bancaMovil: boolean;
            agente: boolean;
            cuotealo: boolean;
        };
        paymentMethodsSort: string[];
    };
}

declare global {
    interface Window {
        CulqiCheckout?: new (publicKey: string, config: CulqiCheckoutConfig) => CulqiInstance;
    }
}

declare global {
    interface Window {
        CulqiCheckout?: new (publicKey: string, config: CulqiCheckoutConfig) => CulqiInstance;
    }
}

export default function ComponentScriptCulqiCustom({ order }: { order: TOrderPopulated }) {
    const [culqiReady, setCulqiReady] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkoutRef = useRef<CulqiInstance | null>(null);

    // Ref espejo de la orden — siempre actualizado sin recrear callbacks
    const orderRef = useRef(order);
    useEffect(() => { orderRef.current = order; }, [order]);

    // ── Handler principal ─────────────────────────────────────────────────────
    // Se usa un ref para que Culqi siempre invoque la versión más reciente,
    // incluso si el componente se re-renderiza entre la apertura y el callback.
    const paymentHandlerRef = useRef<() => Promise<void>>(async () => { });

    paymentHandlerRef.current = async () => {
        const Culqi = checkoutRef.current;
        if (!Culqi) {
            console.error("❌ [Culqi] Handler ejecutado pero checkoutRef es null");
            return;
        }

        console.log("🔔 [Culqi] instance.culqi() ejecutado:", {
            hasToken: !!Culqi.token,
            hasOrder: !!Culqi.order,
            hasError: !!Culqi.error,
            tokenId: Culqi.token?.id,
            orderId: Culqi.order?.id,
            error: Culqi.error,
        });

        if (Culqi.error) {
            console.error("❌ [Culqi] Error del checkout:", {
                user_message: Culqi.error.user_message,
                merchant_message: Culqi.error.merchant_message,
                code: Culqi.error.code,
            });
            return;
        }

        const currentOrder = orderRef.current;
        const amount = 1000; // S/10.00 — reemplazar con currentOrder.totalPrice * 100
        const orderId = String(currentOrder._id);

        setLoading(true);

        try {
            if (Culqi.token) {
                // ── Tarjeta ───────────────────────────────────────────────────
                console.log("💳 [Culqi] Token de tarjeta:", {
                    id: Culqi.token.id,
                    email: Culqi.token.email,
                    last_four: Culqi.token.last_four,
                });

                console.log("📤 [Culqi] Enviando al Server Action...", { amount, orderId });

                await processPaymentCulqi({
                    token: Culqi.token.id,
                    email: Culqi.token.email,
                    amount,
                    orderId,
                });

                console.log("✅ [Culqi] Pago con tarjeta procesado");
                Culqi.close();

            } else if (Culqi.order) {
                // ── Billetera / PagoEfectivo / Yape por orden ────────────────
                console.log("📱 [Culqi] Orden de billetera:", {
                    id: Culqi.order.id,
                });

                console.log("📤 [Culqi] Enviando orden al Server Action...", { amount, orderId });

                await processPaymentCulqi({
                    order: Culqi.order.id,
                    email: currentOrder.user.email || "wilyramos21@gmail.com",
                    amount,
                    orderId,
                });

                console.log("✅ [Culqi] Orden procesada");
                // No cerrar modal en órdenes — el pago puede ser asíncrono
                // para cerar el modal, lo adecuado deberia ser mandar a la pagina de exitoso. 
                //                                Culqi.close();

            }

        } catch (err) {
            console.error("❌ [Culqi] Error en Server Action:", err);
        } finally {
            setLoading(false);
        }
    };

    // ── Inicialización ────────────────────────────────────────────────────────

    const initCheckout = () => {
        const pk = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;

        console.log("🔧 [Culqi] Inicializando CulqiCheckout...");
        console.log("🔑 [Culqi] PK:", pk ? `${pk.slice(0, 12)}...` : "❌ VACÍA");

        if (!pk) {
            console.error("❌ [Culqi] NEXT_PUBLIC_CULQI_PUBLIC_KEY no definida");
            return;
        }

        if (!window.CulqiCheckout) {
            console.error("❌ [Culqi] window.CulqiCheckout no existe");
            return;
        }

        const instance = new window.CulqiCheckout(pk, {
            settings: {
                title: "GOPHONE STORE",
                currency: "PEN",
                amount: 1000,
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

        // ✅ Correcto según doc oficial — el callback se asigna a la instancia,
        //    NO en el constructor. Culqi invoca instance.culqi() tras tokenizar.
        instance.culqi = () => {
            paymentHandlerRef.current();
        };

        checkoutRef.current = instance;
        console.log("✅ [Culqi] Instancia creada, instance.culqi asignado");
        setCulqiReady(true);
    };

    const handleScriptLoad = () => {
        console.log("📥 [Culqi] Script cargado:", typeof window.CulqiCheckout);

        if (window.CulqiCheckout) {
            initCheckout();
            return;
        }

        console.warn("⚠️ [Culqi] CulqiCheckout no disponible aún, reintentando...");
        const interval = setInterval(() => {
            if (window.CulqiCheckout) {
                clearInterval(interval);
                console.log("✅ [Culqi] CulqiCheckout disponible tras reintento");
                initCheckout();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            if (!checkoutRef.current) {
                console.error("❌ [Culqi] CulqiCheckout nunca se inicializó tras 5s");
            }
        }, 5000);
    };

    // ── Render ────────────────────────────────────────────────────────────────

    const openCheckout = () => {
        console.log("🖱️ [Culqi] Click en botón pagar", {
            culqiReady,
            loading,
            hasInstance: !!checkoutRef.current,
        });

        if (!checkoutRef.current) {
            console.error("❌ [Culqi] Sin instancia — ¿el script cargó?");
            return;
        }
        if (loading) {
            console.warn("⚠️ [Culqi] Pago en curso, ignorando click");
            return;
        }

        console.log("🚀 [Culqi] Abriendo modal...");
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
                className={`w-full py-3 px-6 rounded-[var(--radius-sm)] border font-bold transition-all select-none cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-ring
                    ${culqiReady && !loading
                        ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700"
                        : "bg-background-secondary text-muted-foreground border-border cursor-not-allowed opacity-50"
                    }`}
            >
                {loading
                    ? "Procesando pago..."
                    : culqiReady
                        ? "Pagar con Culqi"
                        : "Cargando pasarela..."}
            </button>
        </>
    );
}