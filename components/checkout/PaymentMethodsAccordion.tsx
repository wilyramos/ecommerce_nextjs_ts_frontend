// File: frontend/components/checkout/PaymentMethodsAccordion.tsx

"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";
import CheckoutProMP from "./mercadopago/CheckoutProMP";
import CheckoutYape from "./mercadopago/CheckoutYape";
import { Muted } from "@/components/ui/Typography";
// import CheckoutCulqi from "./culqi/CheckoutCulqi";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {
    const itemBaseClass = "group border border-border rounded-[var(--radius-md)] bg-card overflow-hidden transition-all duration-300";
    const triggerClass = "px-5 py-5 hover:no-underline hover:bg-background-secondary transition-colors focus-visible:outline-hidden";
    const contentClass = "border-t border-border bg-card";
    const textTitleClass = "text-sm font-bold text-foreground";
    const textSubtitleClass = "text-xs text-muted-foreground font-semibold mt-0.5";

    return (
        <section className="w-full space-y-4">
            <Muted className="font-bold select-none">
                Selecciona tu método de pago:
            </Muted>

            <Accordion type="single" collapsible className="flex flex-col gap-3">

                {/* IZIPAY */}
                <AccordionItem
                    value="izipay"
                    className={`${itemBaseClass} data-[state=open]:border-action-cta data-[state=open]:shadow-sm`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border rounded-full transition-colors group-data-[state=open]:border-action-cta">
                                    <div className="w-2.5 h-2.5 rounded-full bg-action-cta scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Tarjeta de Crédito / Débito</span>
                                    <span className={textSubtitleClass}>Procesado por Izipay</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Image src="/payments/visa.png" alt="Visa" width={32} height={20} className="object-contain w-auto h-4" unoptimized/>
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain w-auto h-4" unoptimized/>
                                <div className="w-px h-4 bg-border mx-1 hidden sm:block" />
                                <Image src="/payments/izipay.png" alt="Izipay" width={40} height={20} className="object-contain w-auto h-4 hidden sm:block" unoptimized/>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 max-w-lg mx-auto">
                            <CheckoutIzipay order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* YAPE */}
                <AccordionItem
                    value="yape"
                    className={`${itemBaseClass} data-[state=open]:border-[#742284] data-[state=open]:shadow-sm`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border rounded-full transition-colors group-data-[state=open]:border-[#742284]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#742284] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Yape</span>
                                    <span className={textSubtitleClass}>Aprobación inmediata</span>
                                </div>
                            </div>

                            <Image
                                src="/payments/yape.png"
                                alt="Yape"
                                width={32}
                                height={32}
                                className="object-contain rounded-[var(--radius-sm)] border border-border"
                                unoptimized
                            />
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 flex justify-center">
                            <CheckoutYape order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* MERCADO PAGO */}
                <AccordionItem
                    value="mercadopago"
                    className={`${itemBaseClass} data-[state=open]:border-[#009EE3] data-[state=open]:shadow-sm`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border rounded-full transition-colors group-data-[state=open]:border-[#009EE3]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#009EE3] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Mercado Pago</span>
                                    <span className={textSubtitleClass}>Saldo, Tarjetas bancarias</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Image src="/payments/mercadopago.png" alt="Mercado Pago" width={60} height={24} className="object-contain w-auto h-5" unoptimized />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 text-center space-y-4">
                            <Muted className="font-semibold">
                                Serás redirigido a la plataforma segura de Mercado Pago para completar tu compra.
                            </Muted>
                            <CheckoutProMP orderId={order._id} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* CULQI */}
                <AccordionItem
                    value="culqi"
                    className={`${itemBaseClass} data-[state=open]:border-orange-500 data-[state=open]:shadow-sm`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-border rounded-full transition-colors group-data-[state=open]:border-orange-500">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Culqi (Tarjetas, Yape, Billeteras)</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Image src="/payments/culqi.png" alt="Culqi" width={50} height={20} className="object-contain w-auto h-4" unoptimized/>
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 max-w-lg mx-auto text-gray-400 text-xs italic">
                            Poximamente disponible.
                            {/* <CheckoutCulqi order={order} /> */}
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </section>
    );
}