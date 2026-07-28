// File: frontend/components/admin/orders/OrderTrackingLink.tsx
"use client";

import { useState } from "react";
import { getCourierTrackingInfo } from "@/src/utils/courierTracking";
import { ExternalLink, Copy, Check, Truck } from "lucide-react";

interface Props {
    trackingNumber?: string;
    shippingMethod?: string;
}

export default function OrderTrackingLink({ trackingNumber, shippingMethod }: Props) {
    const [copied, setCopied] = useState(false);

    const info = getCourierTrackingInfo(trackingNumber, shippingMethod);

    if (!info) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground italic py-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Sin guía de seguimiento asignada</span>
            </div>
        );
    }

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(info.cleanCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2 bg-muted/40 border border-border p-2.5 rounded-lg">
            {/* Cabecera */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-primary" /> {info.courierName}
                </span>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted"
                    title="Copiar guía al portapapeles"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">¡Copiado!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>

            {/* Código y Enlace Directo */}
            <div className="flex items-center justify-between gap-2">
                <code className="text-xs font-mono font-bold text-foreground bg-background px-2 py-1 rounded border border-border/60 select-all">
                    {info.cleanCode}
                </code>

                <a
                    href={info.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                    <span>Rastrear en {info.courierName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
    );
}