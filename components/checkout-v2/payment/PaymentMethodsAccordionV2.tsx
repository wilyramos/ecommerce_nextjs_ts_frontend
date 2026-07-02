//File: frontend/components/checkout-v2/payment/PaymentMethodsAccordionV2.tsx

"use client";

import Image from "next/image";
import CheckoutCulqi from "@/components/checkout-v2/culqi/CheckoutCulqi";
import type { OrderResponse } from "@/src/schemas/order.schema";
import PaymentMethods from "@/components/home/PaymentMethods";

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
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <PaymentMethods />
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