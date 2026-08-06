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
import { Button } from '@/components/ui/button';
import { H4, Muted, P } from "@/components/ui/TypographyStore";

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
                    className="relative p-2.5 rounded-full transition-colors hover:bg-background-secondary group cursor-pointer active:scale-95 outline-none select-none"
                >
                    <ShoppingCart
                        size={20}
                        strokeWidth={2}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[9px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="flex flex-col h-full p-0 border-l border-border bg-card text-card-foreground overflow-hidden select-none"
            >
                {/* Header */}
                <SheetHeader className="p-6 border-b border-border bg-background-secondary/50">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                Carrito
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary text-secondary-foreground px-1.5 text-[10px] font-semibold leading-none">
                                    {carrito.length}
                                </span>
                            </SheetTitle>
                        </div>
                    </div>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 scrollbar-thin scrollbar-thumb-border bg-card">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="text-center space-y-1">
                                <H4>
                                    Tu carrito está vacío
                                </H4>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/60">
                            {carrito.map((item) => {
                                const itemDiscount = getItemDiscountAmount(item._id, item.variant?._id);
                                return (
                                    <div
                                        key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                        className="py-4 w-full overflow-hidden"
                                    >
                                        <ItemCarrito
                                            item={item}
                                            discountAmount={itemDiscount}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer y Totales */}
                {carrito.length > 0 && (
                    <div className="p-6 bg-background-secondary/30 border-t border-border mt-auto">
                        <div className="space-y-2 mb-4">
                            {/* Subtotal Bruto */}
                            <div className="flex justify-between items-center">
                                <Muted>Subtotal</Muted>
                                <Muted>S/ {totalSubtotal.toFixed(2)}</Muted>
                            </div>

                            {/* Descuento Aplicado */}
                            {appliedDiscount && discountAmount > 0 && (
                                <div className="flex justify-between items-center pt-1 border-t border-border/40">
                                    <span className="flex items-center gap-1.5 truncate pr-2">
                                        <Tag className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                                        <Muted className="truncate">{discountDisplayName}</Muted>
                                    </span>
                                    <span className="shrink-0 font-mono font-semibold text-xs text-muted-foreground/80">-S/ {discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            {/* Total Neto Estimado */}
                            <div className="flex justify-between items-baseline pt-2 border-t border-border/60">
                                <P>
                                    Total Estimado
                                </P>
                                <div className="text-right select-all">
                                    <Muted className="mr-1 inline">S/</Muted>
                                    <span className="text-2xl font-semibold text-foreground/80">
                                        {totalFinal.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid">
                            <Button
                                onClick={handleCheckout}
                                variant="accent"
                            >
                                Finalizar Compra
                                <ArrowRight size={14} strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}