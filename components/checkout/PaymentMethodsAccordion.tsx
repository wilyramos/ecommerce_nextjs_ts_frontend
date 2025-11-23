"use client";

import { FiCreditCard } from "react-icons/fi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";
import CheckoutProMP from "./mercadopago/CheckoutProMP";
import CheckoutYape from "./mercadopago/CheckoutYape";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {
    return (
        <section className="w-full max-w-3xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
            <p className="flex items-center gap-2 text-sm text-black mb-2">
                    <span className="bg-zinc-100 p-2 rounded-lg">
                        <FiCreditCard className="w-5 h-5 text-zinc-700" />
                    </span>
                    Selecciona un método de pago
                </p>
            </div>

            <Accordion type="single" collapsible className="flex flex-col gap-4">

                {/* IZIPAY */}
                <AccordionItem
                    value="izipay"
                    className="group border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 data-[state=open]:border-zinc-900 data-[state=open]:shadow-lg data-[state=open]:ring-1 data-[state=open]:ring-zinc-900/5"
                >
                    <AccordionTrigger className="px-5 py-5 hover:no-underline hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* Custom Radio UI */}
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border-2 border-zinc-300 rounded-full transition-colors group-data-[state=open]:border-zinc-900">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>
                                
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-semibold text-zinc-900">Tarjeta de Crédito / Débito</span>
                                    <span className="text-xs text-zinc-500 font-medium mt-0.5">Procesado por Izipay</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Image src="/payments/visa.png" alt="Visa" width={32} height={20} className="object-contain w-auto h-4" />
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={32} height={20} className="object-contain w-auto h-4" />
                                <div className="w-px h-4 bg-zinc-300 mx-1 hidden sm:block"></div>
                                <Image src="/payments/izipay.png" alt="Izipay" width={40} height={20} className="object-contain w-auto h-4 hidden sm:block" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-zinc-100 bg-zinc-50/30">
                        <div className="p-6 max-w-lg mx-auto">
                            <CheckoutIzipay order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* YAPE */}
                <AccordionItem
                    value="yape"
                    className="group border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 data-[state=open]:border-[#742284] data-[state=open]:shadow-lg data-[state=open]:ring-1 data-[state=open]:ring-[#742284]/10"
                >
                    <AccordionTrigger className="px-5 py-5 hover:no-underline hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border-2 border-zinc-300 rounded-full transition-colors group-data-[state=open]:border-[#742284]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#742284] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-semibold text-zinc-900">Yape</span>
                                    <span className="text-xs text-zinc-500 font-medium mt-0.5">Aprobación inmediata</span>
                                </div>
                            </div>

                            <Image 
                                src="/payments/yape.png" 
                                alt="Yape" 
                                width={32} 
                                height={32} 
                                className="object-contain " 
                            />
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-zinc-100 bg-zinc-50/30">
                        <div className="p-6 flex justify-center">
                            <CheckoutYape order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* MERCADO PAGO */}
                <AccordionItem
                    value="mercadopago"
                    className="group border border-zinc-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 data-[state=open]:border-[#009EE3] data-[state=open]:shadow-lg data-[state=open]:ring-1 data-[state=open]:ring-[#009EE3]/10"
                >
                    <AccordionTrigger className="px-5 py-5 hover:no-underline hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center w-full justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex items-center justify-center w-5 h-5 shrink-0 border-2 border-zinc-300 rounded-full transition-colors group-data-[state=open]:border-[#009EE3]">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#009EE3] scale-0 transition-transform duration-200 group-data-[state=open]:scale-100" />
                                </div>

                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-semibold text-zinc-900">Mercado Pago</span>
                                    <span className="text-xs text-zinc-500 font-medium mt-0.5">Saldo, Tarjetas, yape</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Image src="/payments/mercadopago.png" alt="Mercado Pago" width={60} height={24} className="object-contain w-auto h-5" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-zinc-100 bg-zinc-50/30">
                        <div className="p-6 text-center">
                            <div className="mb-4 text-sm text-gray-600">
                                Serás redirigido a la plataforma segura de Mercado Pago
                            </div>
                            <CheckoutProMP orderId={order._id} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </section>
    );
}