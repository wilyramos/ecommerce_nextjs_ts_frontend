"use client";

import { useCartStore } from "@/src/store/cartStore";
import ItemCarrito from "./ItemCarrito";
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa";
import { HeadingH1 } from "../ui/Heading";
import { Button } from "../ui/button";

export default function ResumenCarrito() {
    const { cart } = useCartStore();
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const router = useRouter();

    const handleContinuar = () => {
        router.push("/checkout/profile");
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <FaShoppingCart size={50} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-6 text-sm">Tu carrito está vacío.</p>
                <button
                    onClick={() => router.push("/productos")}
                    className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-sm font-medium shadow-sm"
                >
                    Seguir comprando
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-1 md:py-8">
            <HeadingH1 className="text-lg md:text-2xl">Resumen del carrito</HeadingH1>

            <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-8">
                {cart.length} {cart.length === 1 ? "producto" : "productos"} en tu carrito.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-3">
                <div className="md:col-span-2 bg-white rounded-xl p-2 md:p-4">
                    <ul className="divide-y divide-gray-100">
                        {cart.map((item) => (
                            <ItemCarrito key={item._id} item={item} />
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl px-4 py-2 md:p-6 flex flex-col gap-4 md:gap-5">
                    <h2 className="font-semibold text-base md:text-lg text-gray-900">Resumen</h2>

                    <ul className="text-xs md:text-sm text-gray-600 space-y-2 md:space-y-3">
                        <li className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-800">S/ {total.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between border-t pt-2 md:pt-3 text-base md:text-lg font-semibold">
                            <span>Total</span>
                            <span className="text-black">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    <div className="pt-1 md:pt-2">
                        <label className="text-xs md:text-sm text-gray-500 mb-1 block">¿Tienes un cupón?</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-gray-200 bg-gray-100 rounded-lg px-2 py-1.5 text-xs text-gray-500"
                            />
                            <button className="text-xs text-gray-600 border border-gray-200 px-2 py-1.5 rounded-lg bg-gray-50">
                                Aplicar
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] md:text-xs text-gray-400">
                        Verifica tus productos antes de continuar.
                    </p>

                    <Button onClick={handleContinuar} className="w-full text-sm md:text-base">
                        Realizar pedido
                    </Button>
                </div>
            </div>
        </div>

    );
}
