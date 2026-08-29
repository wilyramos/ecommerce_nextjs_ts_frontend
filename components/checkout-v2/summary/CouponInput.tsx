// File: frontend/components/checkout-v2/summary/CouponInput.tsx

"use client";

import { useState, useTransition } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { validateCouponAction } from "@/actions/discount-actions";
import { Loader2, X, Tag } from "lucide-react";
import { BiSolidCoupon } from "react-icons/bi";
import { toast } from "sonner";
import { InputV2 } from "@/components/ui/InputV2";
import { Button } from "@/components/ui/button";
import { P, Small, Price } from "@/components/ui/TypographyStore";

export default function CouponInput() {
    const { cart, total } = useCartStore();
    const { appliedDiscount, setAppliedDiscount, clearDiscount, customerProfile } = useCheckoutStoreV2();

    const [couponCode, setCouponCode] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

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
            const userId = customerProfile?.email;

            const res = await validateCouponAction(
                cleanCode,
                total,
                cartItems,
                userId
            );

            if (res?.ok && res.data) {
                setAppliedDiscount({
                    code: res.data.code ?? cleanCode,
                    discountAmount: res.data.discountAmount,
                    isFreeShipping: res.data.isFreeShipping ?? false,
                });
                setCouponCode("");
                setErrorMsg("");
                toast.success(`Cupón ${res.data.code ?? cleanCode} aplicado correctamente.`);
            } else {
                const err = res?.error || "Cupón no válido o no disponible.";
                setErrorMsg(err);
                toast.error(err);
            }
        });
    };

    const handleRemove = () => {
        clearDiscount();
        setErrorMsg("");
        toast.info("Descuento removido.");
    };

    // Estado 1: Descuento Aplicado
    if (appliedDiscount) {
        const isAutomatic = appliedDiscount.code.startsWith("AUTO-");
        const displayName = isAutomatic
            ? appliedDiscount.code.replace("AUTO-", "")
            : appliedDiscount.code;

        return (
            <div className="flex items-center justify-between bg-muted/20 border border-border px-3 py-2 transition-colors">
                <div className="flex items-center gap-2 text-foreground min-w-0">
                    {isAutomatic ? (
                        <BiSolidCoupon className="w-4 h-4 text-foreground shrink-0" />
                    ) : (
                        <Tag className="w-3.5 h-3.5 text-foreground shrink-0" />
                    )}
                    <P className="truncate text-xs">
                        {isAutomatic ? "Promoción" : "Cupón"}{" "}
                        <Price className="uppercase font-semibold text-foreground">
                            {displayName}
                        </Price>{" "}
                        {appliedDiscount.isFreeShipping
                            ? "(Envío Gratis)"
                            : `(-S/ ${appliedDiscount.discountAmount.toFixed(2)})`}
                    </P>
                </div>
                <button
                    type="button"
                    onClick={handleRemove}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 outline-none"
                    title="Remover descuento"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    // Estado 2: Formulario de Cupón
    return (
        <div className="space-y-1.5">
            <form onSubmit={handleApply} className="flex items-center gap-2">
                <div className="flex-1">
                    <InputV2
                        id="checkout-coupon-code"
                        label="Código de descuento"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            if (errorMsg) setErrorMsg("");
                        }}
                        disabled={isPending || cart.length === 0}
                        className="font-mono uppercase text-xs"
                        aria-invalid={Boolean(errorMsg)}
                    />
                </div>
                <Button
                    type="submit"
                    variant="outline"
                    disabled={isPending || !couponCode.trim() || cart.length === 0}
                >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Aplicar"}
                </Button>
            </form>

            {errorMsg && (
                <Small className="text-destructive px-1 block animate-in fade-in slide-in-from-top-1">
                    {errorMsg}
                </Small>
            )}
        </div>
    );
}