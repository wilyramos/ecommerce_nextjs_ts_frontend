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

    const totalStock = variants?.length
        ? variants.reduce((acc, v) => acc + v.stock, 0)
        : stock;

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
                className={`bg-white rounded-md border p-2 shadow-sm flex flex-col gap-2 relative cursor-pointer ${agotado ? "opacity-60 cursor-not-allowed" : ""
                    }`}
            >
                {hasVariants && !agotado && (
                    <span className="absolute top-2 left-2 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Variantes
                    </span>
                )}

                <div className="relative w-full h-20 bg-zinc-100 rounded flex items-center justify-center overflow-hidden">

                    {/* Badge VARIANTES */}
                    {hasVariants && !agotado && (
                        <span className="absolute top-1 left-1 bg-zinc-900 text-white text-[9px] px-1.5 py-0.5 rounded z-10">
                            VARIANTES
                        </span>
                    )}

                    {/* Botón + */}
                    {!agotado && (
                        <div className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full shadow z-10">
                            <FaPlus size={12} />
                        </div>
                    )}

                    {/* Imagen */}
                    {imagenes?.[0] ? (
                        <Image
                            src={imagenes[0]}
                            alt={nombre}
                            width={80}
                            height={80}
                            className="object-cover w-20 h-20"
                        />
                    ) : (
                        <span className="text-[10px] text-zinc-400">Sin imagen</span>
                    )}
                </div>


                <span className="font-medium text-sm line-clamp-2">{nombre}</span>

                <div className="text-xs text-zinc-500 mt-auto">
                    <div>Cód: {barcode || "---"}</div>

                    <div className="flex justify-between mt-1">
                        <span className="font-semibold text-zinc-900 text-[11px]">
                            {hasVariants ? "Desde " : ""} S/ {precio.toFixed(2)}
                        </span>

                        {!agotado && <span className="text-zinc-700">{totalStock} uds</span>}
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
