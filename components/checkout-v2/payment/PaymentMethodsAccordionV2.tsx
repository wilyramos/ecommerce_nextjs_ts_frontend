//File: frontend/components/checkout-v2/payment/PaymentMethodsAccordionV2.tsx

"use client";

import Image from "next/image";
import CheckoutCulqi from "@/components/checkout-v2/culqi/CheckoutCulqi";
import type { OrderResponse } from "@/src/schemas/order.schema";

interface Props {
    order: OrderResponse;
}

export default function PaymentMethodsSelector({ order }: Props) {
    return (
        <section className="w-full space-y-4 text-foreground">
            <div className="rounded-md border border-border">
                <div className="flex items-center justify-between w-full px-4 py-3.5">
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

                    <div className="flex items-center gap-2 shrink-0">
                        <Image src="/payments/visa-small.svg" alt="Visa" width={28} height={18} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                        <Image src="/payments/master-small.svg" alt="Mastercard" width={28} height={18} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                        <Image src="/payments/amex-small.svg" alt="American Express" width={28} height={18} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                        <div className="hidden sm:block">
                            <Image src="/payments/diners-small.svg" alt="Diners Club" width={28} height={18} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                        </div>
                        <Image src="/payments/yape-small.svg" alt="Yape" width={24} height={24} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                        <Image src="/payments/cuotelao-small.svg" alt="Cuotelao" width={24} height={24} className="object-contain w-auto max-h-4.5 mix-blend-multiply" />
                    </div>
                </div>

                <div className="border-t border-border">
                    <div className="p-5 max-w-md mx-auto">
                        <CheckoutCulqi order={order} />
                    </div>
                </div>
            </div>
        </section>
    );
}