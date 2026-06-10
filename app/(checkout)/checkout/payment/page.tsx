// File: frontend/app/(store)/checkout/payment/page.tsx

import { redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import PaymentMethodsAccordionV2 from "@/components/checkout-v2/payment/PaymentMethodsAccordionV2";
import { FiCreditCard } from "react-icons/fi";
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
        <div className="space-y-5">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-background-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                    <FiCreditCard size={14} strokeWidth={2} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-foreground leading-none">Método de pago</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Elige cómo quieres pagar.</p>
                </div>
            </div>
            <PaymentMethodsAccordionV2 key={order.orderNumber} order={order} />
        </div>
    )
}