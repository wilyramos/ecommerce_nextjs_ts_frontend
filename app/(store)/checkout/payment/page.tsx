import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import PaymentMethodsAccordion from "@/components/checkout/PaymentMethodsAccordion";
import { FiCreditCard } from "react-icons/fi";

type PaymentPageProps = {
  searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/checkout/shipping");

  const order = await getOrder(orderId);
  if (!order) return <p className="text-center py-10">Orden no encontrada</p>;
  if (order.payment.status === "approved") return <p className="text-center py-10">Pago ya realizado</p>;

  return (
        <div className="max-w-2xl mx-auto bg-[var(--color-bg-primary)] p-6 md:p-10 border border-[var(--color-border-subtle)]">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
        <div className="w-8 h-8 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-primary)]">
          <FiCreditCard size={18} />
        </div>
                    <h2 className="text-xl font-bold tracking-tight text-[var(--color-accent-warm)]">
          Método de pago
        </h2>
      </div>

      <PaymentMethodsAccordion order={order} />
    </div>
  );
}