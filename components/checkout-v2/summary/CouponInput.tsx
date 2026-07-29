// File: frontend/components/checkout-v2/summary/CouponInput.tsx
"use client";

import { useState, useTransition } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { validateCouponAction } from "@/actions/discount-actions";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { InputV2 } from "@/components/ui/InputV2";
import { Button } from "@/components/ui/button";

export default function CouponInput() {
    const { cart, total } = useCartStore();
    const { appliedDiscount, setAppliedDiscount, clearDiscount, customerProfile } = useCheckoutStoreV2();

    const [couponCode, setCouponCode] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        const cleanCode = couponCode.trim().toUpperCase();
        if (!cleanCode) {
            toast.error("Ingresa un código de cupón.");
            return;
        }

        const cartItems = cart.map((i) => ({
            productId: i._id,
            variantId: i.variant?._id,
            quantity: i.cantidad,
            price: i.precio,
        }));

        startTransition(async () => {
            const res = await validateCouponAction(
                cleanCode,
                total,
                cartItems,
                customerProfile?.email
            );

            if (res.ok && res.data) {
                setAppliedDiscount({
                    code: res.data.code,
                    discountAmount: res.data.discountAmount,
                });
                setCouponCode("");
                toast.success(`Cupón ${res.data.code} aplicado correctamente.`);
            } else {
                toast.error(res.error || "Cupón no válido.");
            }
        });
    };

    const handleRemove = () => {
        clearDiscount();
        toast.info("Cupón removido.");
    };

    // Estado 1: Cupón Aplicado (Usa variables del sistema)
    if (appliedDiscount) {
        return (
            <div className="flex items-center justify-between bg-muted-neutral border border-border rounded-md px-3 py-2 text-xs">
                <div className="flex items-center gap-2 text-foreground font-medium">
                    <span>
                        Cupón <strong className="font-mono font-bold uppercase text-success">{appliedDiscount.code}</strong> aplicado (-S/ {appliedDiscount.discountAmount.toFixed(2)})
                    </span>
                </div>
                <button
                    type="button"
                    onClick={handleRemove}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Remover cupón"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    // Estado 2: Formulario de Entrada
    return (
        <form onSubmit={handleApply} className="flex items-center gap-2">
            <div className="flex-1">
                <InputV2
                    id="checkout-coupon-code"
                    label="Código de descuento"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    disabled={isPending || cart.length === 0}
                    className="font-mono uppercase text-xs"
                />
            </div>
            <Button
                type="submit"
                variant="outline"
                disabled={isPending || !couponCode.trim() || cart.length === 0}
                className="h-11 px-4 text-xs font-semibold rounded-md border-border shrink-0 min-w-[80px]"
            >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Aplicar"}
            </Button>
        </form>
    );
}