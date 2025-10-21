import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
import PaymentMethodsAccordion from "@/components/checkout/PaymentMethodsAccordion";

type PaymentPageProps = {
  searchParams: Promise<{ orderId: string }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const { orderId } = await searchParams;

  if (!orderId) redirect("/checkout/shipping");

  const order = await getOrder(orderId);
  if (!order) return <p>Orden no encontrada</p>;
  if (order.payment.status === "approved") return <p>Pago ya realizado</p>;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <PaymentMethodsAccordion order={order} />
    </div>
  );
}
