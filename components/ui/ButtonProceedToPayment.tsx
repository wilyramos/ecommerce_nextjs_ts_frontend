"use client"

import { toast } from "sonner";
import { redirect } from "next/navigation";



export default function ButtonProceedToPayment() {

    const handleProceedToPayment = () => {
        setTimeout(() => {
            // alert("Paganndooo...");
        }
        , 3000);
        toast.success("Redirigiendo a la pasarela de pago...");
        redirect("/checkout/pago");
    }

    return (
        <button
            type="button"
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition"
            onClick={handleProceedToPayment}
        >
            Proceder al pago
        </button>
    )
}
