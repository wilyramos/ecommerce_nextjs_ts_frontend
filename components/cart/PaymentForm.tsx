"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useActionState } from "react";
import { createOrderAction } from "@/actions/product/create-order-action";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
    deliveryInfo: {
        nombre: string;
        direccion: string;
        telefono: string;
        correo: string;
    };
}
type prevStateType = {
    errors: string[];
    success: string;
};

export default function PaymentForm({ deliveryInfo }: PaymentFormProps) {

    const router = useRouter();
    const { cart, total, clearCart } = useCartStore();


    const [formState, handleFormSubmit] = useActionState(
        async (prevState: prevStateType, formData: FormData) => {
            // Obtener los datos de la tarjeta del formulario
            const cardNumber = formData.get("cardNumber")?.toString() || "";
            const expiryDate = formData.get("expiryDate")?.toString() || "";

            // Crear el objeto de la orden
            const newOrder = {
                deliveryInfo,
                cart,
                total,
                payment: {
                    cardNumber,
                    expiryDate,
                },
            };

            // Llamar a la acción del servidor
            return await createOrderAction(newOrder, prevState, formData);
        },
        {
            errors: [],
            success: "",
        }
    );

    useEffect(() => {
        if (formState.success) {
            clearCart();
            toast.success(formState.success);
            router.push("/checkout/orden");
        }
    }, [formState.success, clearCart, router]);

    // Formulario de pago
    return (
        <form
            action={handleFormSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            {/* Campo: Número de tarjeta */}
            <div className="mb-4">
                <label
                    htmlFor="cardNumber"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Número de tarjeta
                </label>
                <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Campo: Fecha de expiración */}
            <div className="mb-4">
                <label
                    htmlFor="expiryDate"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Fecha de expiración
                </label>
                <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    placeholder="MM/AA"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* Botón de confirmación */}
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Confirmar Pago
            </button>
        </form>
    );
}
