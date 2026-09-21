"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import ItemCarrito from "./ItemCarrito";
import CouponInput from "@/components/checkout-v2/summary/CouponInput";
import AutomaticDiscountEvaluator from "@/components/checkout-v2/summary/AutomaticDiscountEvaluator";
import { useRouter } from "next/navigation";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import {
    H1,
    H2,
    H3,
    H4,
    P,
    Muted,
    Small,
    Hr,
} from "@/components/ui/TypographyV3";

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
                <ShoppingCart className="size-14 text-text-disabled mb-2" strokeWidth={1.5} />
                <H2>Tu carrito está vacío</H2>
                <Muted>Aún no has agregado productos a tu orden.</Muted>
                <ButtonV3
                    onClick={() => router.push("/productos")}
                    className="mt-6"
                    variant="default"
                    size="lg"
                >
                    Explorar Catálogo
                </ButtonV3>
            </div>
        );
    }

    return (
        <div className="w-full py-4 md:py-8 text-text-primary">
            <AutomaticDiscountEvaluator />

            <div className="flex flex-col gap-1 mb-8">
                <H1>Carrito de Compras</H1>
                <Muted>
                    {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"} seleccionados
                </Muted>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lista de Productos */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                    <div className="divide-y divide-border-primary border-y border-border-primary">
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

                {/* Resumen Sidebar */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="bg-surface-secondary/40 p-6 border border-border-primary/80 rounded-radius-lg sticky top-24 flex flex-col gap-6">
                        <H3>Resumen de Orden</H3>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <P className="text-text-secondary">Subtotal</P>
                                <span className="text-sm font-medium text-text-primary">S/ {total.toFixed(2)}</span>
                            </div>

                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-text-primary">
                                    <span className="flex items-center gap-1.5 truncate pr-2">
                                        <Tag className="size-3.5 shrink-0 text-text-secondary" />
                                        <P className="truncate font-medium text-text-primary">{discountDisplayName}</P>
                                    </span>
                                    <span className="shrink-0 text-sm font-medium text-text-primary">-S/ {discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <P className="text-text-secondary">Tarifa de envío</P>
                                {shippingCost > 0 ? (
                                    <span className="text-sm font-medium text-text-primary">S/ {shippingCost.toFixed(2)}</span>
                                ) : (
                                    <span className="rounded-radius-sm bg-brand-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-inverse">
                                        {isFreeShippingByCoupon ? "Gratis (Promo)" : "Gratis"}
                                    </span>
                                )}
                            </div>
                        </div>

                        <Hr className="my-0 border-border-primary/80" />

                        <div className="flex justify-between items-baseline">
                            <H4 className="text-text-primary">Total</H4>
                            <span className="text-2xl font-semibold tracking-tight text-text-primary">
                                S/ {totalFinal.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <H4 className="text-text-secondary">¿Tienes un cupón?</H4>
                            <CouponInput />
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <ButtonV3
                                onClick={() => router.push("/checkout-v3")}
                                variant="default"
                                size="full"
                            >
                                Ir a Pagar
                                <ArrowRight className="ml-1 size-4" />
                            </ButtonV3>
                            <Small className="text-center font-normal text-text-tertiary">
                                Impuestos incluidos. Costos de envío calculados al finalizar.
                            </Small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}