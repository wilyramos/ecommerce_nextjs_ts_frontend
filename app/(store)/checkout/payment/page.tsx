//File: frontend/app/%28store%29/checkout/payment/page.tsx

import { redirect } from "next/navigation";
import { orderService } from "@/src/services/order-service";
import PaymentMethodsAccordionV2 from "@/components/checkout-v2/payment/PaymentMethodsAccordionV2";
import { FiCreditCard } from "react-icons/fi";
import { H2 } from "@/components/ui/Typography";
import { getTokenOptional } from "@/src/auth/dal";

type PaymentPageProps = {
    searchParams: Promise<{ orderNumber?: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderNumber } = await searchParams;

    if (!orderNumber) {
        redirect("/checkout-v2");
    }

    const token = await getTokenOptional();
    let order;

    try {
        order = await orderService.getOrderByNumber(orderNumber, token);
    } catch (error) {
        console.error("❌ Error recuperando orden en vista de pagos:", error);
        return (
            <p className="text-center py-10 font-bold text-muted-foreground select-none">
                La orden solicitada no existe o expiró su tiempo de reserva.
            </p>
        );
    }

    if (order.payment?.status === "approved") {
        return (
            <p className="text-center py-10 font-bold text-success select-none">
                El pago de esta orden ya ha sido procesado y aprobado con éxito.
            </p>
        );
    }

    return (
        <div className="">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border select-none">
                <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-foreground border border-border">
                    <FiCreditCard size={16} strokeWidth={2} />
                </div>
                <H2>Método de pago</H2>
            </div>
            <PaymentMethodsAccordionV2 key={order.orderNumber} order={order} />
        </div>
    );
}