"use client";

import Script from 'next/script';

export default function LoadScriptMercadoPago() {
    return (
        <Script
            src="https://sdk.mercadopago.com/js/v2"
            strategy="afterInteractive"
            onLoad={() => {
                console.log("✅ SDK de MercadoPago cargado");
            }}
        />
    )
}
