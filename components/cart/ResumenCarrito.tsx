// File: frontend/components/cart/ResumenCarrito.tsx

"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import ItemCarrito from "./ItemCarrito";
import CouponInput from "@/components/checkout-v2/summary/CouponInput";
import AutomaticDiscountEvaluator from "@/components/checkout-v2/summary/AutomaticDiscountEvaluator";
import { useRouter } from "next/navigation";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    H1,
    H2,
    H3,
    H4,
    P,
    Muted,
    Small,
    Price,
    BadgeText,
    Hr,
} from "@/components/ui/TypographyStore";

export default function ResumenCarrito() {
    const { cart } = useCartStore();
    const { appliedDiscount } = useCheckoutStoreV2();
    const router = useRouter();

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);

    const isFreeShippingByCoupon = appliedDiscount?.isFreeShipping ?? false;
    const shippingCost = isFreeShippingByCoupon ? 0 : total < 49 ? 10 : 0;

    const discountAmount = appliedDiscount?.discountAmount ?? 0;
    const isAutomaticDiscount = appliedDiscount?.code.startsWith("AUTO-") ?? false;
    const discountDisplayName = isAutomaticDiscount
        ? appliedDiscount?.code.replace("AUTO-", "")
        : appliedDiscount?.code;

    const totalFinal = Math.max(0, total + shippingCost - discountAmount);

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

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
                <ShoppingCart className="h-14 w-14 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
                <H2>Tu carrito está vacío</H2>
                <Muted>Aún no has agregado productos a tu orden.</Muted>
                <Button
                    onClick={() => router.push("/productos")}
                    className="mt-6 h-10 px-6 bg-foreground text-background hover:bg-foreground/90 font-medium uppercase tracking-wider text-xs transition-colors rounded-none"
                >
                    Explorar Catálogo
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full py-4 md:py-8">
            <AutomaticDiscountEvaluator />

            <div className="flex flex-col gap-1 mb-8">
                <H1>Carrito de Compras</H1>
                <Muted>
                    {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"} seleccionados
                </Muted>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                    <div className="divide-y divide-border border-y border-border">
                        {cart.map((item) => {
                            const itemDiscount = getItemDiscountAmount(item._id, item.variant?._id);
                            return (
                                <ItemCarrito
                                    key={`${item._id}-${item.variant?._id ?? "base"}`}
                                    item={item}
                                    discountAmount={itemDiscount}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="bg-muted/10 p-6 border border-border sticky top-24 flex flex-col gap-6">
                        <H3>Resumen de Orden</H3>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <P>Subtotal</P>
                                <Price>S/ {total.toFixed(2)}</Price>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-foreground">
                                    <span className="flex items-center gap-1.5 truncate pr-2">
                                        <Tag className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                                        <P className="truncate font-medium">{discountDisplayName}</P>
                                    </span>
                                    <Price className="shrink-0">-S/ {discountAmount.toFixed(2)}</Price>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <P>Tarifa de envío</P>
                                {shippingCost > 0 ? (
                                    <Price>S/ {shippingCost.toFixed(2)}</Price>
                                ) : (
                                    <BadgeText className="bg-foreground text-background px-2 py-0.5">
                                        {isFreeShippingByCoupon ? "Gratis (Promo)" : "Gratis"}
                                    </BadgeText>
                                )}
                            </div>
                        </div>

                        <Hr className="my-0" />

                        <div className="flex justify-between items-baseline">
                            <H4 className="text-foreground">Total</H4>
                            <Price className="text-xl font-semibold">
                                S/ {totalFinal.toFixed(2)}
                            </Price>
                        </div>

                        <div className="flex flex-col gap-3">
                            <H4>¿Tienes un cupón?</H4>
                            <CouponInput />
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <Button
                                onClick={() => router.push("/checkout")}


                            >
                                Ir a Pagar
                                <ArrowRight size={15} strokeWidth={2} />
                            </Button>
                            <Small>
                                Impuestos incluidos. Costos de envío calculados al finalizar.
                            </Small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}