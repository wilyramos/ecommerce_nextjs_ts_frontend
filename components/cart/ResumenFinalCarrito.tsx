"use client";

import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { MdOutlineImageNotSupported } from "react-icons/md";

export default function ResumenFinalCarrito() {
    const { cart } = useCartStore();
    const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const envio = 0;
    const total = subtotal + envio;

    return (
        <section className="p-5 border-l md:border-l border-[var(--color-border-subtle)] bg-transparent h-full">
            <Accordion type="single" collapsible defaultValue="resumen">
                <AccordionItem value="resumen" className="border-b-0">
                    <AccordionTrigger className="text-foreground font-semibold text-sm md:text-base pb-1 hover:no-underline">
                        Resumen del carrito
                    </AccordionTrigger>

                    <AccordionContent>
                        <div className="mt-5">
                            {/* Lista de productos */}
                            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[var(--color-border-subtle)] scrollbar-track-transparent">
                                {cart.map((item) => {
                                    const img = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
                                    const price = item.variant?.precio ?? item.precio;
                                    const attrs = item.variant?.atributos ?? null;

                                    return (
                                        <li
                                            key={item._id + (item.variant?._id ?? "")}
                                            className="flex justify-between items-center border-b border-[var(--color-border-subtle)] pb-3 last:border-0"
                                        >
                                            <div className="flex gap-3 items-center min-w-0">
                                                {img ? (
                                                    <Image
                                                        src={img}
                                                        alt={item.variant?.nombre ?? item.nombre}
                                                        width={48}
                                                        height={48}
                                                        quality={70}
                                                        className="w-12 h-12 object-cover rounded-lg border border-[var(--color-border-subtle)]"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
                                                        <MdOutlineImageNotSupported size={18} className="text-muted-foreground" />
                                                    </div>
                                                )}

                                                <div className="flex flex-col min-w-0">
                                                    <p className="font-medium text-foreground text-sm break-words max-w-[150px]">
                                                        {item.nombre}
                                                    </p>

                                                    {attrs && (
                                                        <p className="text-[11px] text-muted-foreground break-words max-w-[150px]">
                                                            {Object.entries(attrs)
                                                                .map(([k, v]) => `${k}: ${v}`)
                                                                .join(" • ")}
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-muted-foreground mt-0.5">
                                                        x{item.cantidad} • S/ {price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                                                S/ {item.subtotal.toFixed(2)}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Sección de Totales */}
                            <div className="border-t border-[var(--color-border-subtle)] mt-6 pt-4 text-sm text-muted-foreground space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-foreground">S/ {subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span>Envío</span>
                                    <span className="text-[10px] font-bold uppercase text-primary bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded-full">
                                        Gratis
                                    </span>
                                </div>

                                <hr className="border-[var(--color-border-subtle)] my-4" />

                                <div className="flex justify-between font-bold text-base text-foreground">
                                    <span>Total</span>
                                    <span className="text-lg">S/ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </section>
    );
}