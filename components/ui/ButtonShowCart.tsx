// File: frontend/components/store/ButtonShowCart.tsx

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
    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });

    const handleCheckout = () => {
        if (carrito.length === 0) {
            toast.error("Tu carrito está vacío.");
            return;
        }
        setCartOpen(false);
        router.push("/checkout");
    }

    return (
        <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
            <SheetTrigger asChild>
                <button className="relative p-2.5 rounded-full transition-colors hover:bg-background-secondary group cursor-pointer active:scale-95 outline-none select-none">
                    <ShoppingCart
                        size={20}
                        strokeWidth={2}
                        className="text-foreground group-hover:text-action-cta transition-colors"
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-action-cta text-action-cta-foreground text-[9px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
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
                <SheetHeader className="p-6 border-b border-border bg-card">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-lg font-semibold  text-foreground">
                                Carrito
                            </SheetTitle>
                            <span className="text-xs font-bold text-muted-foreground bg-background-secondary px-2.5 py-1 border border-border">
                                {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                            </span>
                        </div>
                    </div>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 scrollbar-thin scrollbar-thumb-border bg-card">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                           
                            <div className="text-center space-y-1">
                                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                                    Tu carrito está vacío
                                </h3>
                             
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/60">
                            {carrito.map((item) => (
                                <div
                                    key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                    className="py-4 w-full overflow-hidden"
                                >
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Acciones */}
                {carrito.length > 0 && (
                    <div className="p-6 bg-card border-t border-border mt-auto">
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-baseline pt-2 border-t border-transparent">
                                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total </span>
                                <div className="text-right select-all ">
                                    <span className="text-xs font-semibold text-foreground mr-1">S/</span>
                                    <span className="text-2xl font-semibold text-foreground ">
                                        {total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid">
                            <Button
                                onClick={handleCheckout}
                                variant="accent"
                                className="w-full "
                            >
                                Finalizar Pedido 
                                <ArrowRight size={14} strokeWidth={2.5} className="animate-in fade-in slide-in-from-left-1 duration-300" />
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}