"use client"

import { useCartStore } from "@/src/store/cartStore"
import ItemCarrito from "./ItemCarrito"
import { useRouter } from "next/navigation"
import { FaShoppingCart } from "react-icons/fa"
import { HeadingH1 } from "../ui/Heading"

export default function ResumenCarrito() {
    const { cart } = useCartStore()
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0)
    const router = useRouter()

    const handleContinuar = () => {
        router.push("/checkout/profile")
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-600">
                <FaShoppingCart size={48} className="text-gray-300 mb-4" />
                <p className="mb-3">Tu carrito está vacío.</p>
                <button
                    onClick={() => router.push("/productos")}
                    className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                    Seguir comprando
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <HeadingH1>Resumen del carrito</HeadingH1>
            <p className="text-sm text-gray-400 mb-4">
                {cart.length} {cart.length === 1 ? "producto" : "productos"} seleccionados.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Carrito */}
                <div className="md:col-span-2 bg-white border-r-2 p-4">
                    <ul className="divide-y divide-gray-200">
                        {cart.map((item) => (
                            <ItemCarrito key={item._id} item={item} />
                        ))}
                    </ul>
                </div>

                {/* Resumen */}
                <div className="bg-white border border-gray-50 p-4 space-y-2">
                    <h2 className="text-base text-gray-950 font-semibold">Resumen del pedido</h2>

                    <ul className="text-xs text-gray-600 space-y-2">
                        <li className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-semibold text-gray-800">S/ {total.toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between border-t pt-2 font-bold text-sm">
                            <span>Total</span>
                            <span className="font-semibold text-gray-800">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    <div className="pt-3 opacity-60 ">
                        <label className="text-sm text-gray-400 mb-1 block">
                            ¿Tienes un cupón?
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-gray-300 bg-gray-100 rounded-2xl px-3 py-2 text-xs text-gray-500"
                            />
                            <button
                                // disabled
                                className="text-xs text-gray-400 border border-gray-300 px-3 py-1 rounded-xl bg-gray-100"
                            >
                                Aplicar cupón
                            </button>
                        </div>
                    </div>


                    <p className="text-xs text-gray-400 my-6">
                        Verifica tus productos antes de continuar al siguiente paso.
                    </p>

                    <button
                        onClick={handleContinuar}
                        className="w-full bg-indigo-600 text-white px-4 py-3 rounded-full hover:bg-indigo-800 transition-colors  font-semibold flex items-center justify-center gap-2 hover:cursor-pointer "
                    >
                        Continuar con la compra
                    </button>
                </div>
            </div>
        </div>
    )
}