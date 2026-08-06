// File: frontend/components/cart/ResumenCarrito.tsx

"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import ItemCarrito from "./ItemCarrito";
import CouponInput from "@/components/checkout-v2/summary/CouponInput";
import AutomaticDiscountEvaluator from "@/components/checkout-v2/summary/AutomaticDiscountEvaluator";
import { useRouter } from "next/navigation";
import { ShoppingCart, Tag, ArrowRight } from "lucide-react";
import { H1, Muted, Small } from "../ui/Typography";
import { Button } from "../ui/button";

export default function ResumenCarrito() {
    const { cart } = useCartStore();
    const { appliedDiscount } = useCheckoutStoreV2();
    const router = useRouter();

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);

    const isFreeShippingByCoupon = appliedDiscount?.isFreeShipping ?? false;
    const shippingCost = isFreeShippingByCoupon ? 0 : (total < 49 ? 10 : 0);

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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background">
                <ShoppingCart size={40} className="text-muted-foreground/40 mb-4" strokeWidth={1.5} />
                <Muted className="mb-6">Tu carrito está vacío.</Muted>
                <Button
                    onClick={() => router.push("/productos")}
                    className="bg-foreground text-background px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity text-xs font-bold uppercase tracking-wider"
                >
                    Seguir comprando
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-1 md:py-8 bg-background text-foreground select-none">
            {/* Evaluación en tiempo real para promociones automáticas */}
            <AutomaticDiscountEvaluator />

            <H1 className="text-lg md:text-2xl font-bold uppercase tracking-wide">
                Resumen del carrito
            </H1>

            <Muted className="text-xs md:text-sm mt-1 mb-4 md:mb-8">
                {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"} en tu carrito.
            </Muted>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-4">
                {/* LISTA DE PRODUCTOS */}
                <div className="md:col-span-2 bg-background p-2 md:p-4 border border-border">
                    <div className="divide-y divide-border">
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

                {/* RESUMEN DE ORDEN (Alineado visualmente con el Sheet lateral) */}
                <div className="bg-card p-4 sm:p-6 flex flex-col gap-4 border border-border sticky top-4 h-fit">
                    <div className="space-y-3 text-xs md:text-sm">
                        {/* Subtotal Bruto */}
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span>Subtotal</span>
                            <span className="font-semibold text-foreground">
                                S/ {total.toFixed(2)}
                            </span>
                        </div>

                        {/* Descuento si está aplicado */}
                        {discountAmount > 0 && (
                            <div className="flex justify-between items-center text-foreground font-semibold pt-2 border-t border-border/60">
                                <span className="flex items-center gap-1.5 truncate pr-2">
                                    <Tag className="w-3.5 h-3.5 shrink-0 text-foreground" />
                                    <span className="truncate">{discountDisplayName}</span>
                                </span>
                                <span className="shrink-0 font-mono font-bold">-S/ {discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        {/* Tarifa de envío */}
                        <div className="pt-2 border-t border-border/60 flex justify-between items-center text-muted-foreground">
                            <span>Tarifa de envío</span>
                            {shippingCost > 0 ? (
                                <span className="font-semibold text-foreground">
                                    S/ {shippingCost.toFixed(2)}
                                </span>
                            ) : (
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-foreground bg-background-secondary border border-border px-2 py-0.5">
                                    {isFreeShippingByCoupon ? "Gratis (Promoción)" : "Gratis"}
                                </span>
                            )}
                        </div>

                        {/* Total Estimado */}
                        <div className="flex justify-between items-baseline pt-3 border-t border-border text-base md:text-lg font-bold text-foreground">
                            <span className="uppercase tracking-wider">Total</span>
                            <span className="font-mono">S/ {totalFinal.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* SECCIÓN INTERACTIVA DE CUPÓN */}
                    <div className="pt-3 border-t border-border">
                        <label className="text-xs font-semibold text-foreground mb-2 block uppercase tracking-wider">
                            ¿Tienes un cupón?
                        </label>
                        <CouponInput />
                    </div>

                    <Small className="text-[10px] md:text-xs text-muted-foreground">
                        Verifica tus productos antes de continuar.
                    </Small>

                    <Button 
                        onClick={() => router.push("/checkout")} 
                        className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-bold uppercase tracking-wider text-xs transition-colors gap-2"
                    >
                        <span>Finalizar Compra</span>
                        <ArrowRight size={14} strokeWidth={2.5} />
                    </Button>
                </div>
            </div>
        </div>
    );
}