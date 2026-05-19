// File: components/cart/ResumenCarrito.tsx
"use client";

import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "./ItemCarrito";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { H1, Muted, Small } from "../ui/Typography";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ResumenCarrito() {
    const { cart } = useCartStore();
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalUnidades = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const router = useRouter();

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-background">
                <FaShoppingCart size={40} className="text-muted-foreground/40 mb-4" />
                <Muted className="mb-6">Tu carrito está vacío.</Muted>
                <button
                    onClick={() => router.push("/productos")}
                    className="bg-foreground text-background px-6 py-2.5 rounded-full hover:bg-action-cta hover:text-primary-foreground transition-colors text-sm font-medium outline-none"
                >
                    Seguir comprando
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-1 md:py-8 bg-background text-foreground select-none">
            <H1 className="text-lg md:text-2xl font-bold">
                Resumen del carrito
            </H1>

            <Muted className="text-xs md:text-sm mt-1 mb-4 md:mb-8">
                {totalUnidades} {totalUnidades === 1 ? "producto" : "productos"} en tu carrito.
            </Muted>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-3">

                {/* LISTA DE PRODUCTOS */}
                <div className="md:col-span-2 bg-background rounded-sm p-2 md:p-4 border border-border">
                    <ul className="divide-y divide-border">
                        {cart.map((item) => (
                            <ItemCarrito
                                key={`${item._id}-${item.variant?._id ?? "base"}`}
                                item={item}
                            />
                        ))}
                    </ul>
                </div>

                {/* RESUMEN DE ORDEN */}
                <div className="bg-background rounded-sm px-4 py-4 md:p-6 flex flex-col gap-4 md:gap-5 border border-border sticky top-4 h-fit">
                    <ul className="text-xs md:text-sm text-muted-foreground space-y-2 md:space-y-3">
                        <li className="flex justify-between items-center">
                            <span>Subtotal</span>
                            <span className="font-semibold text-foreground">
                                S/ {total.toFixed(2)}
                            </span>
                        </li>
                        <li>
                            <div className="flex justify-between items-center">
                                <span>Tarifa de envío</span>
                                <span className="text-[10px] md:text-xs font-bold uppercase text-action-cta bg-background-secondary rounded-sm px-2.5 py-0.5 border border-border">
                                    Gratis
                                </span>
                            </div>
                        </li>
                        <li className="flex justify-between border-t border-border pt-2 md:pt-3 text-base md:text-lg font-bold">
                            <span className="text-foreground">Total</span>
                            <span className="text-foreground">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    {/* CUPÓN */}
                    <div className="pt-1 md:pt-2">
                        <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1 block">
                            ¿Tienes un cupón?
                        </label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-border bg-background-secondary rounded-sm px-3 py-2 text-xs text-foreground placeholder-muted-foreground/60 focus:outline-none opacity-50 cursor-not-allowed"
                            />
                            <Button variant="outline" size="sm" disabled>
                                Aplicar
                            </Button>


                        </div>
                    </div>

                    <Small className="text-[10px] md:text-xs text-muted-foreground/70">
                        Verifica tus productos antes de continuar.
                    </Small>

                    <Button onClick={() => router.push("/checkout/profile")} variant="primary">
                        Finalizar Compra
                    </Button>
                </div>
            </div>
        </div>
    );
}