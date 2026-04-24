"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle, 
    SheetTrigger
} from "@/components/ui/sheet";

import { ShoppingCart, ArrowRight, ShoppingBag } from "lucide-react";
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
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

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
                <button className="relative p-2.5 rounded-full transition-all duration-300 hover:bg-[var(--color-bg-tertiary)] group cursor-pointer active:scale-90">
                    <ShoppingCart 
                        size={20} 
                        strokeWidth={1.5} 
                        className="text-[var(--color-text-primary)]" 
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent 
                side="right"
                className="flex flex-col h-full  p-0 border-l border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] overflow-hidden"
            >
                {/* Header */}
                <SheetHeader className="p-6 border-b border-[var(--color-border-subtle)]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                            Resumen de compra
                        </span>
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                                Tu Bolsa
                            </SheetTitle>
                            <span className="bg-[var(--color-bg-tertiary)] px-2.5 py-0.5 rounded-full text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                                {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                            </span>
                        </div>
                    </div>
                </SheetHeader>

                {/* Lista de productos (Sin Scroll X) */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 scrollbar-hide">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="p-8 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                                    Tu bolsa está vacía
                                </h3>
                                <p className="text-sm text-[var(--color-text-secondary)] max-w-[220px] mx-auto mt-2">
                                    Explora nuestra tienda y añade los mejores productos.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--color-border-subtle)]">
                            {carrito.map((item) => (
                                <div 
                                    key={`${item._id}-${item.variant?._id ?? "no-variant"}`} 
                                    className="py-6 w-full overflow-hidden"
                                >
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Acciones */}
                {carrito.length > 0 && (
                    <div className="p-6 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-default)]">
                        <div className="space-y-4 mb-6">
                          
                            
                            <div className="flex justify-between items-baseline pt-4 border-t border-[var(--color-border-subtle)]">
                                <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">Total</span>
                                <div className="text-right">
                                    <span className="text-xl text-[var(--color-text-primary)] tracking-tighter">
                                        S/ {total}
                                    </span>
                                  
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                onClick={handleCheckout}
                                variant="accent"
                            >
                                Finalizar Pedido <ArrowRight size={18} />
                            </Button>
                            
                            <button 
                                onClick={() => setCartOpen(false)}
                                className="w-full py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                            >
                                Continuar Explorando
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}