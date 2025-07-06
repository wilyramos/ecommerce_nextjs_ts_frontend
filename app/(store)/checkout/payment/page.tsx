
import CheckoutSelector from "@/components/checkout/CheckoutSelector";


export default function PaymentPage() {



    return (
        <div className="text-gray-800 text-sm space-y-6">
            {/* Título e instrucciones */}
            <p className="text-xl font-semibold">
                Estamos procesando tu solicitud de pago y te redirigiremos  en breve.
            </p>

            <p className="text-center text-md text-gray-400 ">
                Por favor, no cierres esta ventana ni navegues a otra página mientras se procesa tu pago.
            </p>

            <CheckoutSelector />

        </div>
    );
}
