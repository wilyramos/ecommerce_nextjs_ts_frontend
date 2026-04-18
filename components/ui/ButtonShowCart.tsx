"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle, 
    SheetTrigger
} from "@/components/ui/sheet";

import { ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "../cart/ItemCarrito";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

export default function ButtonShowCart() {
    const carrito = useCartStore((state) => state.cart);
    const isCartOpen = useCartStore((state) => state.isCartOpen);
    const setCartOpen = useCartStore((state) => state.setCartOpen);

    const router = useRouter();
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/carrito");
    }

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2 rounded-full transition-colors hover:bg-[var(--color-surface-hover)] group cursor-pointer">
                    <ShoppingCart 
                        size={22} 
                        strokeWidth={1.5} 
                        className="text-[var(--color-text-primary)] transition-transform group-active:scale-90" 
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent 
                side="right"
                className="flex flex-col h-full bg-[var(--color-bg-primary)] border-l border-[var(--color-border-subtle)] p-0"
            >
                {/* Header Estilo Apple con terminación Carrito */}
                <SheetHeader className="p-4 border-b border-[var(--color-border-subtle)] flex flex-row justify-between items-center">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        Tu Carrito.
                    </SheetTitle>
                    <p className="text-xs text-[var(--color-text-tertiary)] font-medium uppercase tracking-widest">
                        {carrito.length} {carrito.length === 1 ? 'Artículo' : 'Artículos'}
                    </p>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin scrollbar-thumb-[var(--color-border-default)]">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-60">
                            <ShoppingCart size={48} strokeWidth={1} className="text-[var(--color-text-secondary)]" />
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                                Tu carrito está vacío.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--color-border-subtle)]">
                            {carrito.map((item) => (
                                <div key={`${item._id}-${item.variant?._id ?? "no-variant"}`} className="py-2">
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Checkout */}
                {carrito.length > 0 && (
                    <div className="p-6 space-y-4 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-subtle)]">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                                <span className="font-medium text-[var(--color-text-primary)]">S/. {total}</span>
                            </div>
                            
                            <div className="flex justify-between items-end pt-4 border-t border-[var(--color-border-subtle)]">
                                <span className="text-lg font-bold text-[var(--color-text-primary)]">Total</span>
                                <span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tighter">
                                    S/. {total}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3 pb-safe">
                            <Button
                                onClick={handleCheckout}
                                variant="default"
                                size="default"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                Revisar Carrito <ArrowRight size={16} />
                            </Button>
                            
                            <button 
                                onClick={() => setCartOpen(false)}
                                className="w-full text-sm font-medium text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] hover:underline transition-colors"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}