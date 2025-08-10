// frontend/src/hooks/useCulqi.ts
"use client";

import { useEffect, useState } from "react";
import ScriptService from "@/src/utils/script";

declare global {
    interface Window {
        Culqi: any;
    }
}

export function useCulqi() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
        console.log("Culqi public key:", publicKey);
        if (!publicKey) {
            console.error("Culqi public key no configurada");
            return;
        }

        const scriptSrc = "https://checkout.culqi.com/js/v4";
        const culqiScript = new ScriptService("culqi-checkout", "Culqi", scriptSrc);

        culqiScript
            .appendScript()
            .then(() => {
                if (window.Culqi) {
                    window.Culqi.publicKey = publicKey;
                    setReady(true);
                }
            })
            .catch((err) => console.error("Error cargando Culqi:", err));

        return () => {
            culqiScript.destroy();
        };
    }, []);
    return ready;
}
