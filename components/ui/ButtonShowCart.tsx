// File: frontend/components/navigation/ButtonShowCart.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";

import { ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { evaluateAutomaticDiscountsAction } from "@/actions/discount-actions";
import ItemCarrito from "../cart/ItemCarrito";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { H4, Small } from "@/components/ui/TypographyV3";

export default function ButtonShowCart() {
    const carrito = useCartStore((state) => state.cart);
    const totalSubtotal = useCartStore((state) => state.total);
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const appliedDiscount = useCheckoutStoreV2((state) => state.appliedDiscount);
    const setAppliedDiscount = useCheckoutStoreV2((state) => state.setAppliedDiscount);

    const router = useRouter();
    const isManualCoupon = useRef(false);
    const prevCartPayloadRef = useRef<string>("");

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
        if (prevCartPayloadRef.current === currentPayloadKey) {
            return;
        }

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
        const match = appliedDiscount.itemDiscounts.find((d) => {
            if (variantId) {
                return d.productId === productId && d.variantId === variantId;
            }
            return d.productId === productId;
        });
        return match?.discountAmount ?? 0;
    };

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/checkout");
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button
                    data-cart-button
                    className="group relative flex size-9 items-center justify-center rounded-radius-full text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary active:scale-95"
                >
                    <ShoppingCart size={19} strokeWidth={2} />
                    {carrito.length > 0 && (
                        <span className="absolute right-0 top-0 flex size-[15px] animate-in items-center justify-center rounded-radius-full bg-brand-primary text-[9px] font-bold text-text-inverse shadow-xs zoom-in-50 duration-fast">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="flex h-full w-full flex-col overflow-hidden border-l  select-none z-9999"
            >
                {/* Header */}
                <SheetHeader className="border-b border-border-primary/80 bg-surface-secondary/40 px-6 py-5">
                    <SheetTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text-primary">
                        Tu Carrito
                        <span className="flex size-5 items-center justify-center rounded-radius-full border border-border-primary/60 bg-surface-primary text-[10px] font-bold text-text-primary shadow-2xs">
                            {carrito.length}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 scrollbar-thin scrollbar-thumb-border-primary bg-surface-primary">
                    {carrito.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center space-y-3">
                            <ShoppingCart size={32} className="text-text-disabled" />
                            <H4 className="text-sm font-medium text-text-secondary">
                                Tu carrito está vacío
                            </H4>
                        </div>
                    ) : (
                        <div className="divide-y divide-border-primary/60">
                            {carrito.map((item) => {
                                const itemDiscount = getItemDiscountAmount(item._id, item.variant?._id);
                                return (
                                    <ItemCarrito
                                        key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                        item={item}
                                        discountAmount={itemDiscount}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer y Totales */}
                {carrito.length > 0 && (
                    <div className="mt-auto border-t border-border-primary/80 bg-surface-secondary/40 p-6 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
                        <div className="mb-5 space-y-2">
                            {/* Subtotal Bruto */}
                            <div className="flex items-center justify-between">
                                <Small className="text-text-secondary">Subtotal</Small>
                                <Small className="font-medium text-text-primary">S/ {totalSubtotal.toFixed(2)}</Small>
                            </div>

                            {/* Descuento Aplicado */}
                            {appliedDiscount && discountAmount > 0 && (
                                <div className="flex items-center justify-between border-t border-border-primary/60 pt-2">
                                    <span className="flex items-center gap-1.5 truncate pr-2 text-status-success">
                                        <Tag className="size-3.5 shrink-0" />
                                        <Small className="truncate font-medium">{discountDisplayName}</Small>
                                    </span>
                                    <span className="shrink-0 text-xs font-semibold tabular-nums text-status-success">
                                        -S/ {discountAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {/* Total Neto Estimado */}
                            <div className="flex items-baseline justify-between border-t border-border-primary/80 pt-3">
                                <span className="text-sm font-semibold tracking-tight text-text-primary">
                                    Total Estimado
                                </span>
                                <div className="text-right select-all">
                                    <span className="mr-0.5 text-xs text-text-secondary">S/</span>
                                    <span className="text-2xl font-semibold tracking-tight text-text-primary">
                                        {totalFinal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <ButtonV3
                            onClick={handleCheckout}
                            variant="default"
                            size="full"
                            className="justify-between px-5"
                        >
                            <span>Finalizar Compra</span>
                            <ArrowRight size={16} />
                        </ButtonV3>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}