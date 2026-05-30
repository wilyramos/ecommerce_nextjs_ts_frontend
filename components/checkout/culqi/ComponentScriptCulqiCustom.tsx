"use client";

import Script from "next/script";
import { useState, useEffect, useRef } from "react";
import { processPaymentCulqi } from "@/actions/checkout/process-culqi-payment";
import type { TOrderPopulated } from "@/src/schemas";

interface CulqiSettings {
    title: string;
    currency: "PEN" | "USD";
    amount: number;
    description: string;
}

interface CulqiOptions {
    lang?: "auto" | "es" | "en";
    installments?: boolean;
    modal?: boolean;
    paymentMethods?: {
        tarjeta?: boolean;
        yape?: boolean;
        billetera?: boolean;
        bancaMovil?: boolean;
        agente?: boolean;
        cuotealo?: boolean;
    };
    paymentMethodsSort?: string[];
}

interface CulqiObject {
    publicKey?: string;
    settings: (config: CulqiSettings) => void;
    options: (opts: CulqiOptions) => void;
    open: () => void;
    token?: { id: string };
    order?: { id: string }; 
    error?: { user_message: string };
}

declare global {
    interface Window {
        Culqi?: CulqiObject;
        culqi?: () => void;
    }
}

export default function ComponentScriptCulqiCustom({ order }: { order: TOrderPopulated }) {
    const [culqiReady, setCulqiReady] = useState(false);
    const [loading, setLoading] = useState(false);

    // Guardamos la lógica de procesamiento en una referencia para evitar que Culqi ejecute funciones obsoletas
    const paymentHandlerRef = useRef<() => Promise<void>>(async () => {});

    paymentHandlerRef.current = async () => {
        const Culqi = window.Culqi;
        if (!Culqi) return;

        if (Culqi.error) {
            console.error("❌ Error en Culqi Checkout:", Culqi.error);
            alert(Culqi.error.user_message || "Error al procesar con el formulario.");
            return;
        }

        try {
            setLoading(true);
            
            // Datos estáticos de prueba solicitados antes de mapear la orden dinámica
            const testAmount = 1000; // S/. 10.00 pesos en céntimos
            const testDescription = `Pago de prueba - Orden #${order._id}`;

            if (Culqi.token) {
                console.log("Token recibido de tarjeta:", Culqi.token.id);
                await processPaymentCulqi({
                    token: Culqi.token.id,
                    amount: testAmount,
                    description: testDescription,
                });
            } else if (Culqi.order) {
                console.log("Orden recibida de billetera/Yape:", Culqi.order.id);
                await processPaymentCulqi({
                    order: Culqi.order.id,
                    amount: testAmount,
                    description: testDescription,
                });
            }

            console.log("✅ Pago enviado exitosamente al backend");
            // Aquí puedes redirigir con router.push o refrescar el estado de la orden
        } catch (err) {
            console.error("❌ Error en Server Action:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Culqi v4 ejecuta obligatoriamente la función global window.culqi sin parámetros
            window.culqi = () => {
                paymentHandlerRef.current();
            };
        }
    }, []);

    const handleScriptLoad = () => {
        if (typeof window !== "undefined" && window.Culqi) {
            window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
            setCulqiReady(true);
        }
    };

    const openCheckout = () => {
        const Culqi = window.Culqi;
        if (!Culqi || loading) return;

        // Configuración inicial fija para testing de despliegue
        Culqi.settings({
            title: "GOPHONE STORE",
            currency: "PEN",
            amount: 1000, 
            description: `Orden de prueba ${order._id}`,
        });

        Culqi.options({
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
        });

        Culqi.open();
    };

    return (
        <>
            <Script
                src="https://checkout.culqi.com/js/v4"
                strategy="afterInteractive"
                onLoad={handleScriptLoad}
            />

            <button
                type="button"
                onClick={openCheckout}
                disabled={!culqiReady || loading}
                className={`w-full py-3 px-6 rounded-xl border border-orange-500 font-bold transition-all
                    ${culqiReady && !loading 
                        ? "bg-orange-500 text-white hover:bg-orange-600" 
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
            >
                {loading ? "Procesando pago..." : culqiReady ? "Pagar con Culqi" : "Cargando pasarela..."}
            </button>
        </>
    );
}