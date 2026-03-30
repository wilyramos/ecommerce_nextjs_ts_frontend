// File: frontend/components/POS/ProductCardPOS.tsx
"use client";

import { useState } from "react";
import { ProductWithCategoryResponse } from "@/src/schemas";
import Image from "next/image";
import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";
import VariantSelectorModal from "./VariantSelectorModal";
import { FaPlus } from "react-icons/fa";

export default function ProductCardPOS({ product }: { product: ProductWithCategoryResponse }) {
    const [open, setOpen] = useState(false);
    const { nombre, precio, imagenes, stock, barcode, variants } = product;
    const addToCart = useCartStore((s) => s.addToCart);

    const totalStock = variants?.length ? variants.reduce((acc, v) => acc + v.stock, 0) : stock;
    const agotado = !totalStock || totalStock <= 0;
    const hasVariants = variants && variants.length > 0;

    const handleAddClick = () => {
        if (agotado) return;
        if (hasVariants) {
            setOpen(true);
        } else {
            addToCart(product);
            toast.success(`Agregado: ${nombre}`);
        }
    };

    return (
        <>
            <div
                onClick={handleAddClick}
                className={`
                    group flex flex-col bg-[var(--admin-surface)] rounded-xl border border-[var(--admin-border)] 
                    overflow-hidden shadow-sm transition-all duration-200 
                    ${agotado ? "opacity-50 grayscale cursor-not-allowed" : "hover:border-[var(--admin-info)] hover:shadow-md cursor-pointer hover:-translate-y-0.5"}
                `}
            >
                {/* Imagen y Badges */}
                <div className="relative w-full aspect-square bg-[var(--store-bg)] flex items-center justify-center p-2">
                    {/* Badge Variantes */}
                    {hasVariants && !agotado && (
                        <span className="absolute top-2 left-2 bg-[var(--admin-primary)] text-[var(--admin-primary-text)] text-[9px] font-bold tracking-wider px-2 py-1 rounded-md z-10 shadow-sm">
                            OPCIONES
                        </span>
                    )}

                    {/* Badge Agotado */}
                    {agotado && (
                        <span className="absolute top-2 left-2 bg-[var(--admin-destructive-bg)] text-[var(--admin-destructive-text)] text-[10px] font-bold px-2 py-1 rounded-md z-10 border border-[var(--admin-destructive)]/20">
                            AGOTADO
                        </span>
                    )}

                    {/* Botón Flotante "+" */}
                    {!agotado && (
                        <div className="absolute bottom-2 right-2 bg-[var(--admin-surface)] text-[var(--admin-info)] p-2 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity border border-[var(--admin-border)]">
                            <FaPlus size={12} />
                        </div>
                    )}

                    {imagenes?.[0] ? (
                        <Image
                            src={imagenes[0]}
                            alt={nombre}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-contain mix-blend-multiply p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-xs text-[var(--admin-text-muted)] font-medium">Sin imagen</span>
                    )}
                </div>

                {/* Detalles de Texto */}
                <div className="p-3 flex flex-col flex-1 border-t border-[var(--admin-border)] bg-[var(--admin-surface)]">
                    <span className="font-semibold text-xs text-[var(--admin-text)] line-clamp-2 leading-tight mb-1" title={nombre}>
                        {nombre}
                    </span>
                    
                    <div className="mt-auto pt-2 flex flex-col gap-1">
                        <span className="text-[10px] text-[var(--admin-text-muted)] font-mono">
                            {barcode || "SKU N/A"}
                        </span>
                        <div className="flex items-end justify-between">
                            <span className="font-bold text-[var(--admin-info-text)] text-sm">
                                {hasVariants && <span className="text-[10px] text-[var(--admin-text-muted)] font-normal mr-1">Desde</span>}
                                S/ {precio.toFixed(2)}
                            </span>
                            {!agotado && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${totalStock! < 5 ? 'bg-[var(--admin-warning-bg)] text-[var(--admin-warning-text)]' : 'bg-[var(--store-bg)] text-[var(--admin-text-muted)]'}`}>
                                    {totalStock} disp.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {hasVariants && (
                <VariantSelectorModal
                    product={product}
                    open={open}
                    setOpen={setOpen}
                />
            )}
        </>
    );
}