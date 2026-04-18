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
                <button className="relative p-2 rounded-full transition-all duration-300 hover:bg-[var(--color-bg-tertiary)] group cursor-pointer active:scale-95">
                    <ShoppingCart 
                        size={22} 
                        strokeWidth={1.5} 
                        className="text-[var(--color-text-primary)] transition-transform group-hover:rotate-[-5deg]" 
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-0 right-0 bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-sm animate-in zoom-in duration-300">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent 
                side="right"
                className="flex flex-col h-full"
            >
                {/* Header */}
                <SheetHeader className="p-4 border-b border-[var(--color-border-subtle)] space-y-1">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                            Tu Carrito
                        </SheetTitle>
                        <span className="bg-[var(--color-bg-tertiary)] px-3 py-1 rounded-full text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                            {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                        </span>
                    </div>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto px-4 scrollbar-hide">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="p-6 rounded-full bg-[var(--color-bg-secondary)]">
                                <ShoppingBag size={40} strokeWidth={1} className="text-[var(--color-text-tertiary)]" />
                            </div>
                            <div className="text-center">
                                <p className="text-base font-bold text-[var(--color-text-primary)]">
                                    El carrito está vacío
                                </p>
                                <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                                    Explora nuestros productos y agrégalos aquí.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--color-border-subtle)]">
                            {carrito.map((item) => (
                                <div key={`${item._id}-${item.variant?._id ?? "no-variant"}`} className="py-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Checkout */}
                {carrito.length > 0 && (
                    <div className="p-4 space-y-6 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-default)] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[var(--color-text-secondary)]">Subtotal estimado</span>
                                <span className="font-semibold text-[var(--color-text-primary)]">S/ {total}</span>
                            </div>
                            
                            <div className="flex justify-between items-end pt-3 border-t border-[var(--color-border-subtle)]">
                                <span className="text-lg font-bold text-[var(--color-text-primary)]">Total</span>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-[var(--color-text-primary)] tracking-tighter">
                                        S/ {total}
                                    </span>
                                    <p className="text-[10px] text-[var(--color-text-tertiary)] uppercase font-bold">Impuestos incluidos</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Uso correcto de tu componente Button con variante 'default' y tamaño 'lg' */}
                            <Button
                                onClick={handleCheckout}
                                variant="default"
                                size="lg"
                                className="w-full "
                            >
                                Finalizar Pedido <ArrowRight size={18} />
                            </Button>
                            
                            <Button 
                                onClick={() => setCartOpen(false)}
                                variant="link"
                                className="w-full"
                            >
                                Continuar Explorando
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}