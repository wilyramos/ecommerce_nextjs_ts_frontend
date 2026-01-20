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
                <button className="relative p-2 rounded-full transition-colors hover:bg-[var(--store-surface-hover)] group">
                    <ShoppingCart 
                        size={22} 
                        strokeWidth={1.5} 
                        className="text-[var(--store-text)] transition-transform group-active:scale-90" 
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-[var(--store-primary)] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent 
                side="right"
                className="w-full sm:max-w-[440px] flex flex-col h-full bg-[var(--store-surface)] border-l border-[var(--store-border)] p-0"
            >
                {/* Header Estilo Apple con terminación Carrito */}
                <SheetHeader className="p-6 border-b border-[var(--store-border)]">
                    <SheetTitle className="text-2xl font-bold tracking-tight text-[var(--store-text)]">
                        Tu Carrito.
                    </SheetTitle>
                    <p className="text-xs text-[var(--store-text-muted)] font-medium uppercase tracking-widest">
                        {carrito.length} {carrito.length === 1 ? 'Artículo' : 'Artículos'}
                    </p>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-60">
                            <ShoppingCart size={48} strokeWidth={1} className="text-[var(--store-text-muted)]" />
                            <p className="text-sm font-medium text-[var(--store-text-muted)]">
                                Tu carrito está vacío.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--store-border)]">
                            {carrito.map((item) => (
                                <div key={`${item._id}-${item.variant?._id ?? "no-variant"}`} className="py-4">
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Checkout */}
                {carrito.length > 0 && (
                    <div className="p-6 space-y-4 bg-[var(--store-bg)] border-t border-[var(--store-border)]">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-[var(--store-text-muted)]">Subtotal</span>
                                <span className="font-medium text-[var(--store-text)]">S/. {total}</span>
                            </div>
                            
                            <div className="flex justify-between items-end pt-4 border-t border-[var(--store-border)]">
                                <span className="text-lg font-bold text-[var(--store-text)]">Total</span>
                                <span className="text-xl font-bold text-[var(--store-text)] tracking-tighter">
                                    S/. {total}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 space-y-3 pb-safe">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-[var(--store-primary)] text-white text-sm font-semibold py-4 rounded-full hover:bg-[var(--store-primary-hover)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Revisar Carrito <ArrowRight size={16} />
                            </button>
                            
                            <button 
                                onClick={() => setCartOpen(false)}
                                className="w-full text-sm font-medium text-[var(--store-primary)] hover:underline"
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