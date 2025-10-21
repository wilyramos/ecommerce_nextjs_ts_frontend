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
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FaShoppingCart size={50} className="text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4 text-sm">Tu carrito está vacío.</p>
                <button
                    onClick={() => router.push("/productos")}
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    Seguir comprando
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <HeadingH1>Resumen del carrito</HeadingH1>
            <p className="text-sm text-gray-500 mb-6">
                {cart.length} {cart.length === 1 ? "producto" : "productos"} en tu carrito.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Lista de productos */}
                <div className="md:col-span-2 bg-white rounded-2xl shadow-xs p-4">
                    <ul className="divide-y divide-gray-200">
                        {cart.map((item) => (
                            <ItemCarrito key={item._id} item={item} />
                        ))}
                    </ul>
                </div>

                {/* Resumen */}
                <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
                    <h2 className="font-bold text-lg text-gray-800">Resumen</h2>

                    <ul className="text-sm text-gray-600 space-y-3">
                        <li className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-800">S/ {total.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between border-t pt-3 text-lg font-semibold">
                            <span>Total</span>
                            <span className="text-indigo-600">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    {/* Cupón */}
                    <div className="pt-3">
                        <label className="text-sm text-gray-500 mb-1 block">¿Tienes un cupón?</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-gray-200 bg-gray-100 rounded-xl px-3 py-2 text-xs text-gray-500 focus:outline-none"
                            />
                            <button
                                className="text-xs text-gray-500 border border-gray-200 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400">
                        Verifica tus productos antes de continuar al siguiente paso.
                    </p>

                    <Button
                        onClick={handleContinuar}
                        className="w-full mt-2 cursor-pointer"
                    >
                        Realizar pedido
                    </Button>
                </div>
            </div>
        </div>
    );
}
