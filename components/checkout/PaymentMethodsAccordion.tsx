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
        <div className="w-full max-w-2xl mx-auto p-2 space-y-6">
            {/* Encabezado limpio */}
            <div className="border-b pb-2 mb-4">
                <h2 className="flex items-center gap-2 text-sm text-black mb-4 font-semibold">
                    <FiCreditCard className="text-gray-600" />
                    Selecciona tu método de pago
                </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">

                {/* --- OPCIÓN 1: TARJETAS (IZIPAY) --- */}
                <AccordionItem
                    value="izipay"
                    className="border rounded-xl bg-white shadow-sm data-[state=open]:ring-2 data-[state=open]:ring-blue-600 data-[state=open]:border-transparent transition-all duration-200 overflow-hidden"
                >
                    <AccordionTrigger className="px-4 py-4 hover:bg-gray-50 hover:no-underline [&[data-state=open]_.radio-circle]:border-blue-600 [&[data-state=open]_.radio-dot]:bg-blue-600">
                        <div className="flex items-center w-full gap-4">
                            {/* Radio Indicator */}
                            <div className="radio-circle shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors">
                                <div className="radio-dot h-2.5 w-2.5 rounded-full bg-transparent transition-colors" />
                            </div>

                            <div className="flex flex-col items-start flex-1">
                                <span className="font-semibold text-gray-900 text-sm">Tarjeta de Crédito / Débito</span>
                                <span className="text-xs text-gray-500 font-normal">Procesado seguro por Izipay</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex gap-1 opacity-60 grayscale transition-all group-hover:grayscale-0">
                                    <Image src="/payments/visa.png" alt="Visa" width={24} height={16} className="object-contain" />
                                    <Image src="/payments/mastercard.png" alt="MC" width={24} height={16} className="object-contain" />
                                </div>
                                <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>
                                <Image src="/payments/izipay.png" alt="Izipay" width={50} height={25} className="object-contain" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-6 pt-2 border-t bg-gray-50/50">
                        <div className="max-w-md mx-auto mt-4">
                            <CheckoutIzipay order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- OPCIÓN 2: YAPE (CORREGIDO) --- */}
                <AccordionItem
                    value="yape"
                    className="border rounded-xl bg-white shadow-sm data-[state=open]:ring-2 data-[state=open]:ring-purple-600 data-[state=open]:border-transparent transition-all duration-200 overflow-hidden"
                >
                    <AccordionTrigger className="px-4 py-4 hover:bg-gray-50 hover:no-underline [&[data-state=open]_.radio-circle]:border-purple-600 [&[data-state=open]_.radio-dot]:bg-purple-600">
                        <div className="flex items-center w-full gap-4">

                            <div className="radio-circle shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors">
                                <div className="radio-dot h-2.5 w-2.5 rounded-full bg-transparent transition-colors" />
                            </div>

                            <div className="flex flex-col items-start flex-1">
                                <span className="font-semibold text-gray-900 text-sm">Yape</span>
                                {/* TEXTO ACTUALIZADO AQUI: */}
                                <span className="text-xs text-gray-500 font-normal">Ingresa tu número y código de aprobación</span>
                            </div>

                            <Image src="/payments/yape.png" alt="Yape" width={35} height={35} className="object-contain rounded-md" />
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-6 pt-2 border-t bg-purple-50/10">
                        <div className="flex justify-center mt-4">
                            <CheckoutYape order={order} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* --- OPCIÓN 3: MERCADO PAGO --- */}
                <AccordionItem
                    value="mercadopago"
                    className="border rounded-xl bg-white shadow-sm data-[state=open]:ring-2 data-[state=open]:ring-sky-500 data-[state=open]:border-transparent transition-all duration-200 overflow-hidden"
                >
                    <AccordionTrigger className="px-4 py-4 hover:bg-gray-50 hover:no-underline [&[data-state=open]_.radio-circle]:border-sky-500 [&[data-state=open]_.radio-dot]:bg-sky-500">
                        <div className="flex items-center w-full gap-4">

                            <div className="radio-circle shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-colors">
                                <div className="radio-dot h-2.5 w-2.5 rounded-full bg-transparent transition-colors" />
                            </div>

                            <div className="flex flex-col items-start flex-1">
                                <span className="font-semibold text-gray-900 text-sm">Mercado Pago</span>
                                <span className="text-xs text-gray-500 font-normal">Saldo MP, Tarjetas o yape</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex opacity-50 grayscale gap-1">
                                    <Image src="/payments/visa.png" alt="Visa" width={20} height={12} />
                                    <Image src="/payments/mastercard.png" alt="MC" width={20} height={12} />
                                </div>
                                <Image src="/payments/mercadopago.png" alt="MercadoPago" width={65} height={25} className="object-contain" />
                            </div>
                        </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-4 pb-6 pt-2 border-t bg-sky-50/10">
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-700 mb-4 bg-white p-3 rounded-lg border border-sky-100 inline-block shadow-sm">
                                Serás redirigido a la web segura de Mercado Pago.
                            </p>
                            <CheckoutProMP orderId={order._id} />
                        </div>
                    </AccordionContent>
                </AccordionItem>

            </Accordion>
        </div>
    );
}