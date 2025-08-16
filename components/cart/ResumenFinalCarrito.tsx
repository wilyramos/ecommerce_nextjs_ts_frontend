"use client";

import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";

export default function ResumenFinalCarrito() {
    const { cart } = useCartStore();
    const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const envio = 0; // Puedes calcular el costo de envío aquí si es necesario
    // TODO: calcularenvio();
    const total = subtotal + envio;

    return (
        <section className="p-4 border-2 border-slate-200 bg-slate-50 rounded-r-2xl">
            <h3 className="font-semibold mb-4 text-end">Resumen del carrito</h3>

            <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {cart.map((item) => (
                    <li
                        key={item._id}
                        className="flex justify-between items-center border-b border-gray-100 pb-2"
                    >
                        <div className="flex gap-4 items-center">
                            {item.imagenes?.[0] ? (
                                <Image
                                    src={item.imagenes[0]}
                                    alt={item.nombre}
                                    width={40}
                                    height={40}
                                    quality={50}
                                    className="w-12 h-12 object-cover rounded-md border border-gray-100"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded text-xs text-gray-500">
                                    Sin imagen
                                </div>
                            )}
                            <div className="text-sm text-gray-700">
                                <p className="font-medium line-clamp-1">{item.nombre}</p>
                                <p className="text-xs text-gray-500">
                                    x{item.cantidad} • S/. {item.precio.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                            S/. {item.subtotal.toFixed(2)}
                        </span>
                    </li>
                ))}
            </ul>

            <div className="border-t border-gray-200 mt-6 pt-4 text-sm text-gray-700">

                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Envío</span>
                    <span className="font-semibold">S/. {envio.toFixed(2)}</span>
                </div>

                <hr className="border-gray-400 my-6" />


                <div className="flex justify-between font-bold text-base text-gray-900">
                    <span>Total</span>
                    <span>S/. {total.toFixed(2)}</span>
                </div>
            </div>
        </section>
    );
}