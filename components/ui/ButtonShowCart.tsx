// File: frontend/components/navigation/ButtonShowCart.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { evaluateAutomaticDiscountsAction } from "@/actions/discount-actions";
import ItemCarrito from "../cart/ItemCarrito";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { P, Small, Lead } from "@/components/ui/TypographyV3";

export default function ButtonShowCart() {
    const carrito = useCartStore((state) => state.cart);
    const totalSubtotal = useCartStore((state) => state.total);
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const appliedDiscount = useCheckoutStoreV2((state) => state.appliedDiscount);
    const setAppliedDiscount = useCheckoutStoreV2((state) => state.setAppliedDiscount);

    const router = useRouter();
    const isManualCoupon = useRef(false);
    const prevCartPayloadRef = useRef("");

    const cartItemsPayload = useMemo(() => {
        return carrito.map((item) => ({
            productId: item._id,
            variantId: item.variant?._id,
            quantity: item.cantidad,
            price: item.precio,
        }));
    }, [carrito]);

    useEffect(() => {
        if (appliedDiscount && !appliedDiscount.code.startsWith("AUTO-")) {
            isManualCoupon.current = true;
        } else if (!appliedDiscount) {
            isManualCoupon.current = false;
        }
    }, [appliedDiscount]);

    useEffect(() => {
        if (!isCartOpen || cartItemsPayload.length === 0 || isManualCoupon.current) return;

        const currentPayloadKey = JSON.stringify({ totalSubtotal, cartItemsPayload });
        if (prevCartPayloadRef.current === currentPayloadKey) return;

        let isMounted = true;
        const timer = setTimeout(async () => {
            const res = await evaluateAutomaticDiscountsAction(totalSubtotal, cartItemsPayload);
            if (!isMounted) return;

            prevCartPayloadRef.current = currentPayloadKey;

            if (res?.ok && res.data?.appliedDiscount && res.data.discountAmount > 0) {
                const autoDisc = res.data.appliedDiscount;
                setAppliedDiscount({
                    code: `AUTO-${autoDisc.title}`,
                    discountAmount: res.data.discountAmount,
                    isFreeShipping: autoDisc.type === "FREE_SHIPPING",
                    itemDiscounts: res.data.itemDiscounts,
                });
            } else if (!isManualCoupon.current) {
                setAppliedDiscount(null);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [isCartOpen, totalSubtotal, cartItemsPayload, setAppliedDiscount]);

    const discountAmount = appliedDiscount?.discountAmount ?? 0;
    const isAutomaticDiscount = appliedDiscount?.code.startsWith("AUTO-") ?? false;
    const discountDisplayName = isAutomaticDiscount
        ? appliedDiscount?.code.replace("AUTO-", "")
        : appliedDiscount?.code;

    const totalFinal = Math.max(0, totalSubtotal - discountAmount);

    const getItemDiscountAmount = (productId: string, variantId?: string) => {
        if (!appliedDiscount?.itemDiscounts) return 0;
        const match = appliedDiscount.itemDiscounts.find((d) =>
            variantId ? d.productId === productId && d.variantId === variantId : d.productId === productId
        );
        return match?.discountAmount ?? 0;
    };

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/checkout-v3");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button
                    type="button"
                    data-cart-button
                    className="relative flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary active:scale-95"
                    aria-label="Abrir carrito"
                >
                    <ShoppingCart size={19} strokeWidth={2} />
                    {carrito.length > 0 && (
                        <span className="absolute right-0 top-0 flex size-3.5 items-center justify-center rounded-full bg-brand-primary">
                            <Small className="text-[9px] font-bold text-text-inverse">{carrito.length}</Small>
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent side="right" className="flex h-full flex-col p-0">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Lead>Tu Carrito</Lead>
                        <span className="flex size-5 items-center justify-center rounded-full border border-border-primary bg-surface-secondary">
                            <Small className="text-[10px] font-medium text-text-primary">{carrito.length}</Small>
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6">
                    {carrito.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-text-tertiary">
                            <ShoppingCart size={32} />
                            <P className="font-medium text-text-tertiary">Tu carrito está vacío</P>
                        </div>
                    ) : (
                        <div className="divide-y divide-border-primary">
                            {carrito.map((item) => (
                                <ItemCarrito
                                    key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                    item={item}
                                    discountAmount={getItemDiscountAmount(item._id, item.variant?._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {carrito.length > 0 && (
                    <SheetFooter className="gap-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <Small>Subtotal</Small>
                                <Small className="text-text-primary">S/ {totalSubtotal.toFixed(2)}</Small>
                            </div>

                            {appliedDiscount && discountAmount > 0 && (
                                <div className="flex justify-between text-status-success">
                                    <span className="flex items-center gap-1 truncate">
                                        <Tag size={12} />
                                        <Small className="truncate text-status-success">{discountDisplayName}</Small>
                                    </span>
                                    <Small className="text-status-success">-S/ {discountAmount.toFixed(2)}</Small>
                                </div>
                            )}

                            <div className="flex items-baseline justify-between border-t border-border-primary pt-2">
                                <P className="font-semibold text-text-primary">Total Estimado</P>
                                <Lead className="text-xl font-bold text-text-primary">S/ {totalFinal.toFixed(2)}</Lead>
                            </div>
                        </div>

                        <ButtonV3 onClick={handleCheckout} size="full" className="justify-between">
                            <P className="font-medium text-text-inverse">Finalizar Compra</P>
                            <ArrowRight size={16} />
                        </ButtonV3>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}