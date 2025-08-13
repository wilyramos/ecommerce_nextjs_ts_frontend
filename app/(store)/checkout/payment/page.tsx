// frontend/src/app/payment/page.tsx
import { FiCreditCard } from "react-icons/fi";
import CheckoutMercadoPagoBricks from "@/components/checkout/mercadopago/CheckoutMercadoPagoBricks";
import CheckoutIzipay from "@/components/checkout/izipay/CheckoutIzipay";
// import CheckoutCulqi from "@/components/checkout/culqi/CheckoutCulqi";
// import CheckoutSelector from "@/components/checkout/CheckoutSelector";

export default function PaymentPage() {

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
                <CheckoutIzipay />
            </div>
        </div>
    );
}
