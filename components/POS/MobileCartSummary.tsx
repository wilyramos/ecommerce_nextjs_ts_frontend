"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import VentaCart from "./VentaCart";

export default function MobileCartSummary() {
    const cart = useCartStore((s) => s.cart);
    const [isOpen, setIsOpen] = useState(false);

    const totalItems = cart.length;
    const totalAmount = cart.reduce((acc, item) => acc + item.subtotal, 0);

    // Si no hay ítems, no mostramos la barra en móvil
    if (totalItems === 0) return null;

    return (
        <>
            {/* BARRA FLOTANTE (Oculta en Desktop lg) */}
            <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-[var(--admin-primary)] text-[var(--admin-primary-text)] rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] active:scale-[0.98] transition-transform"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <FaShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-[var(--admin-info)] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[var(--admin-primary)]">
                                {totalItems}
                            </span>
                        </div>
                        <span className="font-semibold tracking-wide text-sm">Ver Pedido</span>
                    </div>

                    <span className="text-lg font-black tracking-tight">
                        S/ {totalAmount.toFixed(2)}
                    </span>
                </button>
            </div>

            {/* DRAWER / MODAL DEL CARRITO EN MÓVIL */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent side="bottom" className="h-[90dvh] p-0 bg-[var(--admin-surface)] rounded-t-2xl border-t border-[var(--admin-border)] flex flex-col outline-none">
                    <VisuallyHidden><SheetTitle>Carrito de Compras</SheetTitle></VisuallyHidden>

                    {/* Reutilizamos el componente VentaCart tal cual */}
                    <div className="flex-1 h-full overflow-hidden relative rounded-t-2xl">
                        <VentaCart onMobileClose={() => setIsOpen(false)} />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}