"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";
import CheckoutProMP from "./mercadopago/CheckoutProMP";
import CheckoutYape from "./mercadopago/CheckoutYape";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {

    // Clases comunes para los items del acordeón
    const itemBaseClass = "group border border-[var(--color-border-subtle)] rounded-xl bg-transparent overflow-hidden transition-all duration-300";
    const triggerClass = "px-5 py-5 hover:no-underline hover:bg-[var(--color-bg-secondary)] transition-colors";
    const contentClass = "border-t border-[var(--color-border-subtle)] bg-transparent";
    const textTitleClass = "text-sm font-semibold text-foreground";
    const textSubtitleClass = "text-xs text-muted-foreground font-medium mt-0.5";
    return (
        <section className="w-full">
            <p className="text-sm text-[var(--store-text-muted)] mb-4">
                Selecciona tu metodo de pago:

            </p>

            <Accordion type="single" collapsible className="flex flex-col gap-3">

                {/* IZIPAY */}
                <AccordionItem
                    value="izipay"
                    className={`${itemBaseClass} data-[state=open]:border-[var(--color-accent-warm)] data-[state=open]:shadow-md`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* Custom Radio UI */}
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-[var(--color-border-subtle)] rounded-full transition-colors group-data-[state=open]:border-[var(--color-accent-warm)]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent-warm)] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Tarjeta de Crédito / Débito</span>
                                    <span className={textSubtitleClass}>Procesado por Izipay</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ">
                                <Image src="/payments/visa.png" alt="Visa" width={32} height={20} className="object-contain w-auto h-4" />
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain w-auto h-4" />
                                <div className="w-px h-4 bg-[var(--store-border)] mx-1 hidden sm:block"></div>
                                <Image src="/payments/izipay.png" alt="Izipay" width={40} height={20} className="object-contain w-auto h-4 hidden sm:block" />
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
                    className={`${itemBaseClass} data-[state=open]:border-[#742284] data-[state=open]:shadow-md`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-[var(--store-border)] rounded-full transition-colors group-data-[state=open]:border-[#742284]">
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
                                className="object-contain rounded-md"
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
                    className={`${itemBaseClass} data-[state=open]:border-[#009EE3] data-[state=open]:shadow-md`}
                >
                    <AccordionTrigger className={triggerClass}>
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border border-[var(--store-border)] rounded-full transition-colors group-data-[state=open]:border-[#009EE3]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#009EE3] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className={textTitleClass}>Mercado Pago</span>
                                    <span className={textSubtitleClass}>Saldo, Tarjetas</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Image src="/payments/mercadopago.png" alt="Mercado Pago" width={60} height={24} className="object-contain w-auto h-5" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className={contentClass}>
                        <div className="p-6 text-center">
                            <div className="mb-4 text-xs text-[var(--store-text-muted)]">
                                Serás redirigido a la plataforma segura de Mercado Pago para completar tu compra.
                            </div>
                            <CheckoutProMP orderId={order._id} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </section>
    );
}