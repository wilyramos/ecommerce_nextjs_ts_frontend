"use client";

import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { FaShoppingCart } from "react-icons/fa";
import Image from "next/image";

import { useCartStore } from "@/src/store/cartStore";

// Simulación de hook de carrito
const useCart = () => {
    const cart = [
        { id: "1", name: "Producto A", price: 25, quantity: 2, image: "/logo.svg" },
        { id: "2", name: "Producto B", price: 40, quantity: 1, image: "/logo.svg" },
    ];
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return { cart, total };
};

export default function ButtonShowCart() {
    const router = useRouter();
    const { cart, total } = useCart();

    const addToCart = useCartStore(state => state.addToCart);

    const carrito = useCartStore(state => state.cart);
    console.log("Carrito desde el botón:", carrito);


    return (
        <>
            <Sheet>
                <SheetTrigger className="text-gray-800 hover:text-blue-600 transition-all duration-200 ease-in-out cursor-pointer">
                    <div className="relative">
                        <FaShoppingCart className="h-5 w-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cart.length}
                            </span>
                        )}
                    </div>
                </SheetTrigger>
                <SheetContent className="sm:max-w-[450px]">
                    <SheetHeader>
                        <SheetTitle>Carrito de compras</SheetTitle>
                        <SheetDescription>
                            Lista de productos en tu carrito.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                        {carrito.length === 0 ? (
                            <p className="text-center text-gray-500">Tu carrito está vacío.</p>
                        ) : (
                            carrito.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                                    <Image 
                                        src={"/logo.svg"}
                                        alt={item.nombre}
                                        width={60}
                                        height={60}
                                        className="rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">{item.nombre}</h3>
                                        <p className="text-xs text-gray-500">Cantidad: {item.cantidad}</p>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        S/. {(item.precio).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* <div className="mt-6 space-y-4">
                        {cart.length === 0 ? (
                            <p className="text-center text-gray-500">Tu carrito está vacío.</p>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                                    <Image src={item.image} alt={item.name} width={60} height={60} className="rounded" />
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium">{item.name}</h3>
                                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        S/. {(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cart.length > 0 && (
                        <div className="mt-6">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>S/. {total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={() => router.push("/checkout")}
                                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                                Ir a pagar
                            </button>
                            <button
                                onClick={() => addToCart({ id: "3", name: "Producto C", price: 30 })}
                                className="w-full mt-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                            >
                                Agregar otro producto
                            </button>
                        </div>
                    )} */}
                </SheetContent>
            </Sheet>
        </>
    );
}
