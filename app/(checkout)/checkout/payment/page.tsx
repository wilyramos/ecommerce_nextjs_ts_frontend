import { redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import PaymentMethodsAccordionV2 from "@/components/checkout-v2/payment/PaymentMethodsAccordionV2";
import SyncPendingOrder from "@/components/checkout-v2/payment/SyncPendingOrder";
import { H1, Muted, P } from "@/components/ui/TypographyV3";

type PaymentPageProps = { searchParams: Promise<{ orderNumber?: string }> };

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderNumber } = await searchParams;

    if (!orderNumber) redirect("/checkout");

    let order;

    try {
        order = await orderService.getOrderByNumber(orderNumber);
    } catch (error) {
        console.error("❌ Error recuperando orden:", error);
        return (
            <Muted className="text-center py-10 text-sm select-none">
                La orden no existe o expiró su tiempo de reserva.
            </Muted>
        );
    }

    if (order.payment?.status === "approved") {
        return (
            <P className="text-center py-10 text-sm font-semibold text-status-success select-none">
                El pago ya fue procesado y aprobado.
            </P>
        );
    }

    return (
        <div className="space-y-6">
            <SyncPendingOrder order={order} />

            <div className="border-b border-border-primary pb-5">
                <H1>
                    Método de pago
                </H1>
                <Muted className="mt-1 text-sm">
                    Elige cómo quieres pagar
                </Muted>
            </div>
            <PaymentMethodsAccordionV2 key={order.orderNumber} order={order} />
        </div>
    );
}