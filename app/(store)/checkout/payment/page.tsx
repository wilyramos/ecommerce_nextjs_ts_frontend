// frontend/src/app/payment/page.tsx
import { FiCreditCard } from "react-icons/fi";
// import CheckoutMercadoPagoBricks from "@/components/checkout/mercadopago/CheckoutMercadoPagoBricks";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
import { redirect } from "next/navigation";
import { getOrder } from "@/src/services/orders";
// import CheckoutCulqi from "@/components/checkout/culqi/CheckoutCulqi";
// import CheckoutSelector from "@/components/checkout/CheckoutSelector";


type PaymentPageProps = {
    searchParams: Promise<{
        orderId: string;
    }>;
};

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
    const { orderId } = await searchParams;

    if(!orderId){
        redirect("/checkout/shipping")
    }
    // Leer de la url orderId

    const order = await getOrder(orderId);
    if(!order) {
        return <p>Orden no encontrada</p>;
    }
    if(order.payment.status === "approved") {
        return <p>Pago ya realizado</p>;
    }

    return (
        <div className="px-4 py-6 max-w-xl mx-auto">
            <div className="flex items-center gap-2 text-gray-700 text-sm mb-4">
                <FiCreditCard className="text-base" />
                <h1 className="text-sm sm:text-base font-medium">
                    Selecciona tu método de pago
                </h1>
            </div>
            <div>
                {/* <h2>Pagar con mercado pago</h2> */}
                {/* <CheckoutMercadoPagoBricks /> */}
            </div>

            <div>
                {/* <CheckoutSelector /> */}
                {/* <CheckoutCulqi /> */}
                <CheckoutIzipay
                    order={order}
                />
            </div>
        </div>
    );
}
