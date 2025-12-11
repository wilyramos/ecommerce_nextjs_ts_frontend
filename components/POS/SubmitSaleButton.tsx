//File: 

"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { submitSaleAction } from "@/actions/pos/submit-sale-action";
import type { CreateSaleInput } from "@/src/schemas";

export default function SubmitSaleButton() {
    const clearCart = useCartStore((s) => s.clearCart);
    const cart = useCartStore((s) => s.cart);
    const total = useCartStore((s) => s.total);
    const dni = useCartStore((s) => s.dni);
    const clearDni = useCartStore((s) => s.clearDni);
    const comprobante = useCartStore((s) => s.comprobante);
    const clearComprobante = useCartStore((s) => s.clearComprobante);
    const setSaleCompleted = useCartStore((s) => s.setSaleCompleted);
    const setSaleIdStore = useCartStore((s) => s.setSaleId);


    const router = useRouter();

    const sale: CreateSaleInput = {
        items: cart.map((item) => ({
            product: item._id,
            // AQUÍ LA CORRECCIÓN CLAVE:
            // Si el item tiene variante, enviamos su ID como 'variantId'
            variantId: item.variant ? item.variant._id : undefined,
            quantity: item.cantidad,
            price: item.precio, // El store ya tiene el precio correcto (variante o base)
        })),
        totalPrice: total,
        totalDiscountAmount: 0,
        status: "COMPLETED",
        paymentMethod: "CASH",
        paymentStatus: "approved",
        customerDNI: dni || undefined,
        receiptType: comprobante || "TICKET",
    };

    const submitSaleWithData = submitSaleAction.bind(null, sale);
    const [state, dispatch] = useActionState(submitSaleWithData, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            setSaleIdStore(state.success); // store
            toast.success("Venta guardada con éxito");
            clearCart();
            clearDni();
            clearComprobante();
            setSaleCompleted(true);
        }
    }, [state, router, clearCart, clearDni, clearComprobante, setSaleCompleted, setSaleIdStore,]);

    return (
        <div className="space-y-4">
            <form action={dispatch}>
                <input
                    type="submit"
                    className="w-full bg-rose-600 text-white font-semibold py-2 hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer px-4 rounded"
                    value="GUARDAR VENTA"
                />
            </form>
        </div>
    );
}
