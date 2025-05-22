"use client"

import { useCartStore } from "@/src/store/cartStore";
import { useActionState } from "react";
import { createOrderAction } from "@/actions/product/create-order-action";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PaymentForm() {
    const { cart, total, clearCart } = useCartStore();
    const router = useRouter();

    const createOrder = createOrderAction.bind(null, total);
    const [state, dispatch] = useActionState(createOrder, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.success) {
            clearCart();
            toast.success(state.success);
            router.push("/checkout/orden");
        }
    }, [state.success, router, clearCart]);

    // Envolver el handler para agregar productos antes de enviar
    const handleSubmit = async (formData: FormData) => {
        formData.append("productos", JSON.stringify(cart));
        dispatch(formData);
    };

    return (
        <form
            action={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
            <div className="mb-4">
                <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                <input type="text" name="nombre" id="nombre" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
            </div>

            <div className="mb-4">
                <label htmlFor="direccion" className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                <input type="text" name="direccion" id="direccion" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
            </div>

            <div className="mb-4">
                <label htmlFor="telefono" className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                <input type="text" name="telefono" id="telefono" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white w-full py-3 rounded-full hover:bg-blue-700 transition"
            >
                Confirmar y Pagar
            </button>
        </form>
    );
}
