import { FiCreditCard } from 'react-icons/fi';
import CheckoutSelector from '@/components/checkout/CheckoutSelector';
// import ClientCheckoutWrapper from "@/components/checkout/mercadopago/ClientCheckoutWrapper";
// import LoadScriptMercadoPago from "@/components/checkout/mercadopago/LoadScriptMercadoPago";

export default function PaymentPage() {
    return (
        <div className="px-4 py-6 max-w-xl mx-auto">
            {/* <LoadScriptMercadoPago /> */}

            <div className="flex items-center gap-2 text-gray-700 text-sm mb-4">
                <FiCreditCard className="text-base" />
                <h1 className="text-sm sm:text-base font-medium">
                    Selecciona tu método de pago
                </h1>
            </div>

            {/* <ClientCheckoutWrapper /> */}
            <CheckoutSelector />
            {/* <ClientCheckoutWrapper /> */}
        </div>
    );
}
