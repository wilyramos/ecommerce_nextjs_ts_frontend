"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ResumenFinalCarrito() {
    const { cart } = useCartStore();
    const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const envio = 0;
    const total = subtotal + envio;

    const [open, setOpen] = useState(true);

    // 
    useEffect(() => {
        if(window.innerWidth >= 768) {
            setOpen(true);
        }
    }, [])

    return (
        <section className="p-4 border-l-2 border-gray-200">
            {/* Botón para mostrar/ocultar */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-gray-800 font-bold text-lg focus:outline-none"
            >
                <span className="text-gray-700 font-bold text-sm border-b-2 border-gray-400">Resumen del carrito</span>
                {open ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </button>

            {/* Contenido desplegable */}
            {open && (
                <div className="mt-4">
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
                </div>
            )}
        </section>
    );
}
