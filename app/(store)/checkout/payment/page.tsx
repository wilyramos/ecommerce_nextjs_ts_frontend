// File: frontend/app/(store)/checkout/payment/page.tsx

import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import PaymentMethodsAccordion from "@/components/checkout/PaymentMethodsAccordion";
import { FiCreditCard } from "react-icons/fi";
import { H2 } from "@/components/ui/Typography";

type PaymentPageProps = {
  searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/checkout/shipping");

  const order = await getOrder(orderId);
  if (!order) return <p className="text-center py-10 font-bold text-muted-foreground select-none">Orden no encontrada</p>;
  if (order.payment.status === "approved") return <p className="text-center py-10 font-bold text-success select-none">Pago ya realizado</p>;

  return (
    <div className="max-w-2xl mx-auto bg-card p-6 md:p-10 border border-border rounded-[var(--radius-lg)] text-card-foreground shadow-xs">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border select-none">
        <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-foreground border border-border">
          <FiCreditCard size={16} strokeWidth={2} />
        </div>
        <H2>
          Método de pago
        </H2>
      </div>

      <PaymentMethodsAccordion order={order} />
    </div>
  );
}