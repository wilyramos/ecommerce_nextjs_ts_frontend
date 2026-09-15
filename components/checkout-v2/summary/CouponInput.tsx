"use client";

import { useState, useTransition } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { validateCouponAction } from "@/actions/discount-actions";
import { Loader2, X, Tag } from "lucide-react";
import { BiSolidCoupon } from "react-icons/bi";
import { toast } from "sonner";
import { InputV3 } from "@/components/ui/InputV3";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { P } from "@/components/ui/TypographyV3";

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
            <div className="flex items-center justify-between bg-surface-secondary/40 border border-border-primary px-3 py-2 rounded-radius-md transition-colors">
                <div className="flex items-center gap-2 text-text-primary min-w-0">
                    {isAutomatic ? (
                        <BiSolidCoupon className="w-4 h-4 text-text-primary shrink-0" />
                    ) : (
                        <Tag className="w-3.5 h-3.5 text-text-primary shrink-0" />
                    )}
                    <P className="truncate text-xs">
                        {isAutomatic ? "Promoción" : "Cupón"}{" "}
                        <span className="uppercase font-semibold text-text-primary">
                            {displayName}
                        </span>{" "}
                        <span className="text-text-secondary">
                            {appliedDiscount.isFreeShipping
                                ? "(Envío Gratis)"
                                : `(-S/ ${appliedDiscount.discountAmount.toFixed(2)})`}
                        </span>
                    </P>
                </div>
                <button
                    type="button"
                    onClick={handleRemove}
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-radius-sm"
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
            <form onSubmit={handleApply} className="flex items-start gap-2">
                <div className="flex-1">
                    <InputV3
                        id="checkout-coupon-code"
                        label="Código de descuento"
                        value={couponCode}
                        onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            if (errorMsg) setErrorMsg("");
                        }}
                        disabled={isPending || cart.length === 0}
                        className="font-mono uppercase text-xs"
                        error={errorMsg} // InputV3 maneja internamente el aria-invalid y el mensaje
                    />
                </div>
                <ButtonV3
                    type="submit"
                    variant="outline"
                    className="h-12" // Alineado exactamente con la altura h-12 del InputV3
                    disabled={isPending || !couponCode.trim() || cart.length === 0}
                >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : "Aplicar"}
                </ButtonV3>
            </form>
        </div>
    );
}