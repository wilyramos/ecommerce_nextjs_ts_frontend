"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

import { RiShoppingCartLine } from "react-icons/ri";
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
            <SheetTrigger className="relative cursor-pointer hover:text-gray-800 transition">
                <RiShoppingCartLine className="h-6 w-6" />
                {carrito.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                        {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
                    </span>
                )}
            </SheetTrigger>

            <SheetContent className="sm:max-w-[450px] px-6 py-5 bg-gray-50 border-l border-gray-200 shadow-2xl rounded-lg">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-gray-900">
                        Carrito de Compras
                    </SheetTitle>
                    <SheetDescription className="text-xs text-gray-500">
                        Aquí puedes revisar los productos seleccionados.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-5 max-h-[65vh] overflow-y-auto pr-2">
                    {carrito.length === 0 ? (
                        <p className="text-center text-gray-400 ">
                            Tu carrito está vacío.
                        </p>
                    ) : (
                        carrito.map((item) => (
                            <ItemCarrito
                                key={`${item._id}-${item.variant?._id ?? "no-variant"}`}
                                item={item}
                            />
                        ))
                    )}
                </div>

                {carrito.length > 0 && (
                    <div className="pt-2 pb-20">
                        <div className="flex items-center justify-between text-sm text-gray-700 pb-6">
                            <span className="text-gray-500">Total</span>
                            <span className="text-base font-semibold">S/. {total}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className=" w-full bg-black text-white text-sm py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            Ir a pagar
                        </button>
                    </div>
                )}

            </SheetContent>
        </Sheet>
    );
}
