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
                <button className="relative p-2.5 rounded-full transition-all duration-300 hover:bg-background-secondary group cursor-pointer active:scale-90">
                    <ShoppingCart
                        size={20}
                        strokeWidth={1.5}
                        className="text-foreground group-hover:text-action-cta transition-colors"
                    />
                    {carrito.length > 0 && (
                        <span className="absolute top-1 right-1 bg-action-cta text-action-cta-foreground text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                            {carrito.length}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent
                side="right"
                className="flex flex-col h-full p-0 border-l border-border bg-background overflow-hidden"
            >
                {/* Header */}
                <SheetHeader className="p-6 border-b border-border">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <SheetTitle className="text-xl font-semibold text-foreground">
                                Carrito
                            </SheetTitle>
                            <span className="bg-background-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold text-muted-foreground uppercase border border-border">
                                {carrito.length} {carrito.length === 1 ? 'Ítem' : 'Ítems'}
                            </span>
                        </div>
                    </div>
                </SheetHeader>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2 scrollbar-thin scrollbar-thumb-border">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4">
                            <div className="p-8 rounded-full bg-background-secondary text-muted-foreground border border-border">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-foreground tracking-tight">
                                    Tu bolsa está vacía
                                </h3>
                                <p className="text-sm text-muted-foreground max-w-[220px] mx-auto mt-1">
                                    Explora nuestra tienda y añade los mejores productos.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/40">
                            {carrito.map((item) => (
                                <div
                                    key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                    className="py-3 w-full overflow-hidden"
                                >
                                    <ItemCarrito item={item} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer y Acciones */}
                {carrito.length > 0 && (
                    <div className="p-6 bg-background border-t border-border">
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-baseline pt-2">
                                <span className="text-lg font-bold tracking-tight text-foreground">Total</span>
                                <div className="text-right">
                                    <span className="text-xl font-extrabold text-foreground tracking-tighter">
                                        S/ {total}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <Button
                                onClick={handleCheckout}
                                className="w-full bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-semibold flex items-center justify-center gap-2"
                            >
                                Finalizar Pedido <ArrowRight size={18} />
                            </Button>

                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-full py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
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