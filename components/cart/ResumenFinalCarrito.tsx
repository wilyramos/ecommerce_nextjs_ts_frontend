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

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setOpen(true);
    }
  }, []);

  return (
    <section className="p-5 border-l md:border-l-2 border-gray-100 bg-white md:rounded-l-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-gray-900 font-semibold text-base md:text-lg transition-colors hover:text-black"
      >
        <span className="text-sm md:text-base font-semibold border-b-2 border-gray-300 pb-0.5">
          Resumen del carrito
        </span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="mt-5">
          <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {cart.map((item) => {
              const img = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
              const price = item.variant?.precio ?? item.precio;
              const attrs = item.variant?.atributos ?? null;

              return (
                <li
                  key={item._id + (item.variant?._id ?? "")}
                  className="flex justify-between items-center border-b border-gray-100 pb-3"
                >
                  <div className="flex gap-3 items-center min-w-0">
                    {img ? (
                      <Image
                        src={img}
                        alt={item.variant?.nombre ?? item.nombre}
                        width={48}
                        height={48}
                        quality={70}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg text-[10px] text-gray-400">
                        Sin imagen
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <p className="font-medium text-gray-800 text-sm break-words max-w-[150px]">
                        {item.nombre}
                      </p>

                      {attrs && (
                        <p className="text-[11px] text-gray-500 break-words max-w-[150px]">
                          {Object.entries(attrs)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" • ")}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-0.5">
                        x{item.cantidad} • S/ {price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    S/ {item.subtotal.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-gray-200 mt-6 pt-4 text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500">
              <span>Envío</span>
              <span>S/ {envio.toFixed(2)}</span>
            </div>

            <hr className="border-gray-200 my-4" />

            <div className="flex justify-between font-bold text-base text-gray-900">
              <span>Total</span>
              <span className="text-lg">S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
