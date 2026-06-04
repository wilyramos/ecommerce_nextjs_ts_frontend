//File: frontend/components/checkout-v2/payment/PaymentMethodsAccordionV2.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
// import { Muted } from "@/components/ui/Typography";
// import CheckoutProMP from "@/components/checkout/mercadopago/CheckoutProMP";
import CheckoutCulqi from "@/components/checkout-v2/culqi/CheckoutCulqi";
import type { OrderResponse } from "@/src/schemas/order.schema";

interface Props {
    order: OrderResponse;
}

interface GatewayConfig {
    id: string;
    isCustomTitle: boolean;
    titleElement?: React.ReactNode;
    titleText?: string;
    logos: { src: string; alt: string; width: number; height: number; hideOnMobile?: boolean }[];
    renderContent: (order: OrderResponse) => React.ReactNode;
}

export default function PaymentMethodsSelector({ order }: Props) {
    const [selectedGateway, setSelectedGateway] = useState<string>("culqi");

    const MAP_GATEWAYS: GatewayConfig[] = [
        {
            id: "culqi",
            isCustomTitle: true,
            titleElement: (
                <div className="flex items-center gap-2">
                    <Image 
                        src="/payments/culqi.png" 
                        alt="Culqi" 
                        width={42} 
                        height={18} 
                        className="object-contain w-auto h-4.5 mix-blend-multiply select-none"
                    />
                    <span className="text-xs text-muted-foreground font-semibold">(Tarjetas o Yape)</span>
                </div>
            ),
            logos: [
                { src: "/payments/visa-small.svg", alt: "Visa", width: 28, height: 18 },
                { src: "/payments/master-small.svg", alt: "Mastercard", width: 28, height: 18 },
                { src: "/payments/amex-small.svg", alt: "American Express", width: 28, height: 18 },
                { src: "/payments/diners-small.svg", alt: "Diners Club", width: 28, height: 18, hideOnMobile: true },
                { src: "/payments/yape-small.svg", alt: "Yape", width: 24, height: 24 }
            ],
            renderContent: (o) => <CheckoutCulqi order={o} />
        },
        // {
        //     id: "mercadopago",
        //     isCustomTitle: false,
        //     titleText: "Billetera Mercado Pago",
        //     logos: [
        //         { src: "/payments/mercadopago.png", alt: "Mercado Pago", width: 55, height: 22 }
        //     ],
        //     renderContent: (o) => (
        //         <div className="space-y-3 text-center">
        //             <Muted className="text-xs font-semibold leading-relaxed">
        //                 Serás redirigido a la pasarela segura de Mercado Pago.
        //             </Muted>
        //             <CheckoutProMP orderId={o._id} />
        //         </div>
        //     )
        // }
    ];

    return (
        <section className="w-full space-y-4 text-foreground">
            
            <div className="flex flex-col gap-2.5">
                {MAP_GATEWAYS.map((gateway) => {
                    const isSelected = selectedGateway === gateway.id;

                    return (
                        <div
                            key={gateway.id}
                            className={`border rounded-[var(--radius-md)] bg-card transition-all duration-200 ${
                                isSelected 
                                    ? "border-primary ring-1 ring-primary/30 shadow-xs" 
                                    : "border-border hover:border-muted-foreground/20"
                            }`}
                        >
                            <label className="flex items-center justify-between w-full px-5 py-4 cursor-pointer select-none">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="radio"
                                        name="payment-gateway"
                                        value={gateway.id}
                                        checked={isSelected}
                                        onChange={() => setSelectedGateway(gateway.id)}
                                        className="w-4 h-4 text-primary border-border focus:ring-primary/40 cursor-pointer"
                                    />
                                    {gateway.isCustomTitle ? (
                                        gateway.titleElement
                                    ) : (
                                        <span className="text-sm font-bold text-foreground leading-none">
                                            {gateway.titleText}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {gateway.logos.map((logo, index) => (
                                        <div key={index} className={logo.hideOnMobile ? "hidden sm:block" : "block"}>
                                            <Image
                                                src={logo.src}
                                                alt={logo.alt}
                                                width={logo.width}
                                                height={logo.height}
                                                className="object-contain w-auto max-h-4.5 mix-blend-multiply"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </label>

                            <div
                                className="border-t border-border bg-background-secondary/15 overflow-hidden"
                                style={{ display: isSelected ? "block" : "none" }}
                            >
                                <div className="p-6 max-w-md mx-auto">
                                    {gateway.renderContent(order)}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}