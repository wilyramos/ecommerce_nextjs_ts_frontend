"use client";

import { FiCreditCard } from "react-icons/fi";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import type { TOrderPopulated } from "@/src/schemas";
import Image from "next/image";

export default function PaymentMethodsAccordion({ order }: { order: TOrderPopulated }) {
  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Título principal */}
      <div className="flex items-center gap-2 text-black mb-4">
        <FiCreditCard className="text-2xl " />
        <h2 className="text-xl font-semibold">Selecciona tu método de pago</h2>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {/* Izipay */}
        <AccordionItem value="izipay">
          <AccordionTrigger className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Pagar con</span>
              <Image
                src="/payments/izipay.png"
                alt="IZIPAY"
                width={80}
                height={24}
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Image src="/payments/visa.png" alt="Visa" width={24} height={16} className="object-contain" />
              <Image src="/payments/mastercard.png" alt="Mastercard" width={24} height={16} className="object-contain" />
              <Image src="/payments/amex.png" alt="Amex" width={24} height={16} className="object-contain" />
              <Image src="/payments/diners.png" alt="Diners" width={24} height={16} className="object-contain" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="mt-2 p-4 bg-gray-50 rounded-lg">
            <CheckoutIzipay order={order} />
          </AccordionContent>
        </AccordionItem>

        {/* Mercado Pago */}
        <AccordionItem value="mercadopago">
          <AccordionTrigger className="flex items-center justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Pagar con</span>
              <Image
                src="/payments/mercadopago.png"
                alt="Mercado Pago"
                width={50}
                height={16}
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Image src="/payments/visa.png" alt="Visa" width={24} height={16} className="object-contain" />
              <Image src="/payments/mastercard.png" alt="Mastercard" width={24} height={16} className="object-contain" />
              <Image src="/payments/yape.png" alt="Yape" width={48} height={16} className="object-contain" />
            </div>

          </AccordionTrigger>
          <AccordionContent className="mt-2 p-4 bg-gray-50 rounded-lg">
            {/* <CheckoutMercadoPagoBricks order={order} /> */}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
