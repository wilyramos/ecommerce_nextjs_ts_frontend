// File: frontend/components/POS/SubmitSaleButton.tsx
"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom"; // IMPORTANTE: Hook nativo de React
import { toast } from "sonner";
import { submitSaleAction } from "@/actions/pos/submit-sale-action";
import type { CreateSaleInput } from "@/src/schemas";
import { BarLoader } from "react-spinners";

// 1. Creamos un sub-componente estricto para el botón. 
// useFormStatus() SOLO funciona si está dentro de un <form>
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`
                w-full flex items-center justify-center h-12 rounded-lg font-bold text-sm tracking-wider uppercase transition-all
                ${pending 
                    ? "bg-[var(--admin-primary-hover)] text-[var(--admin-text-muted)] cursor-not-allowed opacity-80" 
                    : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg"
                }
            `}
        >
            {pending ? (
                <div className="flex items-center gap-3">
                    <span className="text-white/80">PROCESANDO</span>
                    <BarLoader width={40} height={3} color="white" speedMultiplier={1.5} />
                </div>
            ) : (
                "COBRAR AHORA"
            )}
        </button>
    );
}

// 2. El Componente Principal
export default function SubmitSaleButton() {
    const { 
        clearCart, cart, total, dni, clearDni, 
        comprobante, clearComprobante, setSaleCompleted, setSaleId 
    } = useCartStore();

    const sale: CreateSaleInput = {
        items: cart.map((item) => ({
            product: item._id,
            variantId: item.variant ? item.variant._id : undefined,
            quantity: item.cantidad,
            price: item.precio,
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
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((error) => toast.error(error));
        }
        if (state.success) {
            setSaleId(state.success); 
            toast.success("Venta guardada con éxito");
            clearCart();
            clearDni();
            clearComprobante();
            setSaleCompleted(true);
        }
    }, [state, clearCart, clearDni, clearComprobante, setSaleCompleted, setSaleId]);

    return (
        <form action={dispatch} className="w-full">
            <SubmitButton />
        </form>
    );
}