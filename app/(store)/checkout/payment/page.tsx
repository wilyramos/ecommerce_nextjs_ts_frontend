
import CheckoutSelector from "@/components/checkout/CheckoutSelector";

export default function PaymentPage() {

    return (

            <div className="text-gray-800 text-sm space-y-6">
                {/* Título e instrucciones */}
                <p className="font-semibold">
                    SELECCIONA TU MEDIO DE PAGO
                </p>

            
                <CheckoutSelector />
            </div>

    );
}
