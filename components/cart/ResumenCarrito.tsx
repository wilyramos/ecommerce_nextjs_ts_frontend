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
                <FaShoppingCart size={50} className="text-[var(--store-border)] mb-4" />
                <p className="text-[var(--store-text-muted)] mb-6 text-sm">Tu carrito está vacío.</p>
                <button
                    onClick={() => router.push("/productos")}
                    className="bg-[var(--store-primary)] text-[var(--store-primary-text)] px-6 py-2.5 rounded-full hover:bg-[var(--store-primary-hover)] transition-colors text-sm font-medium "
                >
                    Seguir comprando
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-1 md:py-8">
            <HeadingH1 className="text-lg md:text-2xl text-[var(--store-text)]">Resumen del carrito</HeadingH1>

            <p className="text-xs md:text-sm text-[var(--store-text-muted)] mb-4 md:mb-8">
                {cart.length} {cart.length === 1 ? "producto" : "productos"} en tu carrito.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-3">
                {/* LISTA DE PRODUCTOS */}
                <div className="md:col-span-2 bg-[var(--store-surface)] rounded-xl p-2 md:p-4 border border-[var(--store-border)]">
                    <ul className="divide-y divide-[var(--store-border)]">
                        {cart.map((item) => (
                            <ItemCarrito key={item._id} item={item} />
                        ))}
                    </ul>
                </div>

                {/* RESUMEN DE ORDEN */}
                <div className="bg-[var(--store-surface)] rounded-xl px-4 py-2 md:p-6 flex flex-col gap-4 md:gap-5 border border-[var(--store-border)] sticky top-4 h-fit">

                    <ul className="text-xs md:text-sm text-[var(--store-text-muted)] space-y-2 md:space-y-3">
                        <li className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="font-medium text-[var(--store-text)]">S/ {total.toFixed(2)}</span>
                        </li>
                        <li>
                            <div className="flex justify-between items-center">
                                <span>Tarifa de envío</span>
                                {/* Badge estilo sutil */}
                                <span className="text-[10px] md:text-xs font-bold uppercase text-[var(--store-primary)] bg-[var(--store-surface-hover)] rounded-2xl px-2 py-1">
                                    Gratis
                                </span>
                            </div>
                        </li>
                        <li className="flex justify-between border-t border-[var(--store-border)] pt-2 md:pt-3 text-base md:text-lg font-semibold">
                            <span className="text-[var(--store-text)]">Total</span>
                            <span className="text-[var(--store-text)]">S/ {total.toFixed(2)}</span>
                        </li>
                    </ul>

                    {/* CUPÓN */}
                    <div className="pt-1 md:pt-2">
                        <label className="text-xs md:text-sm text-[var(--store-text-muted)] mb-1 block">
                            ¿Tienes un cupón?
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingresa tu cupón"
                                disabled
                                className="flex-1 border border-[var(--store-border)] bg-[var(--store-bg)] rounded-lg px-3 py-2 text-xs text-[var(--store-text)] placeholder-[var(--store-text-muted)] focus:outline-none opacity-70"
                            />
                            <button
                                className="text-xs text-[var(--store-text-muted)] border border-[var(--store-border)] px-3 py-2 rounded-lg bg-[var(--store-surface-hover)] hover:bg-[var(--store-border)] transition-colors"
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] md:text-xs text-[var(--store-text-muted)]">
                        Verifica tus productos antes de continuar.
                    </p>

                    <Button
                        onClick={handleContinuar}
                        className="w-full text-sm md:text-base cursor-pointer bg-[var(--store-primary)] hover:bg-[var(--store-primary-hover)] text-[var(--store-primary-text)] border-none"
                    >
                        Realizar pedido
                    </Button>
                </div>
            </div>
        </div>
    );
}