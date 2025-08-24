"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { submitSaleAction } from "@/actions/pos/submit-sale-action";
import type { CreateSaleInput } from "@/src/schemas";
import PrintReceiptButton from "./PrintReceiptButton";

export default function SubmitSaleButton() {
    const clearCart = useCartStore((s) => s.clearCart);
    const cart = useCartStore((s) => s.cart);
    const total = useCartStore((s) => s.total);
    const dni = useCartStore((s) => s.dni);
    const clearDni = useCartStore((s) => s.clearDni);
    const comprobante = useCartStore((s) => s.comprobante);
    const clearComprobante = useCartStore((s) => s.clearComprobante);

    const router = useRouter();
    const [saleId, setSaleId] = useState<string | null>(null);

    const sale: CreateSaleInput = {
        items: cart.map((item) => ({
            product: item._id,
            quantity: item.cantidad,
            price: item.precio,
        })),
        totalPrice: total,
        totalDiscountAmount: 0,
        status: "COMPLETED",
        paymentMethod: "CASH",
        paymentStatus: "approved",
        customerDNI: dni || undefined,
        source: "POS",
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
            toast.success("Venta creada correctamente");
            setSaleId(state.success); // guardamos el ID de la venta
            // clearDni();
            // clearCart();
            // clearComprobante();
        }
    }, [state, router, clearCart, clearDni]);

    const handlePrint = () => {
        if (saleId) {
            // Puedes apuntar al backend directo o a un proxy en Next.js
            window.open(`/api/sales/${saleId}/pdf`, "_blank");
        }
    };

    return (
        <div className="space-y-4">
            <form action={dispatch}>
                <input
                    type="submit"
                    className="w-full bg-rose-600 text-white font-semibold py-2 hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer px-4 rounded"
                    value="GUARDAR VENTA"
                />
            </form>

            {saleId && <PrintReceiptButton saleId={saleId} />}

        </div>
    );
}
