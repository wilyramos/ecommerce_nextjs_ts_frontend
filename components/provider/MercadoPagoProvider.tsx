// frontend/src/components/MercadoPagoProvider.tsx
"use client";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useEffect } from "react";
import { useRef } from "react";


export default function MercadoPagoProvider() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;

        console.log("Inicializando Mercado Pago SDK...");
        console.log("Public Key:", process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY);
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ?? "", {
            locale: "es-PE",
        });
        initialized.current = true;
        console.log("Mercado Pago SDK inicializado.");
    }, []);

    return null;
}