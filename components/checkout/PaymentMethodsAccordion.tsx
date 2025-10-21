"use client";

import { FiCreditCard } from "react-icons/fi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";
import CheckoutProMP from "./mercadopago/CheckoutProMP";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {
    return (
        <div className="max-w-xl mx-auto p-2">
            {/* Título principal */}
            <p className="flex items-center gap-2 text-sm text-black mb-4 font-semibold">
                <FiCreditCard />
                Selecciona tu método de pago:

            </p>

            <Accordion type="single" collapsible className="space-y-3">
                {/* Izipay */}
                <AccordionItem value="izipay">
                    <AccordionTrigger className="flex gap-2 justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/payments/izipay.png"
                                alt="IZIPAY"
                                width={60}
                                height={24}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="border rounded p-1">
                                <Image src="/payments/visa.png" alt="Visa" width={24} height={16} className="object-contain" />
                            </div>
                            <div className="border rounded p-1">
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={24} height={16} className="object-contain" />
                            </div>
                            <div className="border rounded p-1">
                                <Image src="/payments/amex.png" alt="Amex" width={24} height={16} className="object-contain" />
                            </div>
                            <div className="border rounded p-1">
                                <Image src="/payments/diners.png" alt="Diners" width={24} height={16} className="object-contain" />
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-2 p-4 items-center justify-center flex rounded-lg">
                        <CheckoutIzipay order={order} />
                    </AccordionContent>
                </AccordionItem>

                {/* Mercado Pago */}
                <AccordionItem value="mercadopago">
                    <AccordionTrigger className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/payments/mercadopago.png"
                                alt="Mercado Pago"
                                width={50}
                                height={16}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="border rounded p-1">
                                <Image src="/payments/visa.png" alt="Visa" width={24} height={16} className="object-contain" />
                            </div>
                            <div className="border rounded p-1">
                                <Image src="/payments/mastercard.png" alt="Mastercard" width={24} height={16} className="object-contain" />
                            </div>
                            <div className="">
                                <Image src="/payments/yape.png" alt="Yape" width={48} height={16} className="object-contain" />
                            </div>
                        </div>

                    </AccordionTrigger>
                    <AccordionContent className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Al seleccionar esta opción, serás redirigido a la plataforma segura de Mercado Pago para completar tu pago.</p>
                        <CheckoutProMP orderId={order._id} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
