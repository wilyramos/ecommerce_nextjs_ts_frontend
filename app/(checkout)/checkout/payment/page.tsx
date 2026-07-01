// File: frontend/app/(store)/checkout/payment/page.tsx

import { redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import PaymentMethodsAccordionV2 from "@/components/checkout-v2/payment/PaymentMethodsAccordionV2";
import { getTokenOptional } from "@/src/auth/dal";

type PaymentPageProps = { searchParams: Promise<{ orderNumber?: string }> }

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderNumber } = await searchParams

    if (!orderNumber) redirect("/checkout")

    const token = await getTokenOptional()
    let order

    try {
        order = await orderService.getOrderByNumber(orderNumber, token)
    } catch (error) {
        console.error("❌ Error recuperando orden:", error)
        return (
            <p className="text-center py-10 text-sm text-muted-foreground select-none">
                La orden no existe o expiró su tiempo de reserva.
            </p>
        )
    }

    if (order.payment?.status === "approved") {
        return (
            <p className="text-center py-10 text-sm font-semibold text-success select-none">
                El pago ya fue procesado y aprobado.
            </p>
        )
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-border pb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Método de pago
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    Elige cómo quieres pagar.
                </p>
            </div>
            <PaymentMethodsAccordionV2 key={order.orderNumber} order={order} />
        </div>
    )
}