
import CheckoutSelector from "@/components/checkout/CheckoutSelector";


export default function PaymentPage() {



    return (
        <div className="text-gray-800 text-sm space-y-6">
            {/* Título e instrucciones */}
            <p className="text-xl font-semibold">
                Proceso de pago
            </p>

            <p className="text-center text-lg text-gray-400 ">
                Por favor, selecciona una de las siguientes opciones para completar tu pago.
            </p>

            <CheckoutSelector />

        </div>
    );
}
