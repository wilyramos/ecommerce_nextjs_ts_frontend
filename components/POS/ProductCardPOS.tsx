"use client"; // Necesario para usar estado

import { ProductWithCategoryResponse } from "@/src/schemas";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa";
import VariantSelectorModal from "./VariantSelectorModal";

export default function ProductCardPOS({ product }: { product: ProductWithCategoryResponse }) {
    const { nombre, precio, imagenes, stock, barcode, variants } = product;
    const addToCart = useCartStore((s) => s.addToCart);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lógica para determinar stock total visual (suma de variantes o stock base)
    const totalStock = variants && variants.length > 0 
        ? variants.reduce((acc, v) => acc + v.stock, 0) 
        : stock;

    const agotado = !totalStock || totalStock <= 0;
    const hasVariants = variants && variants.length > 0;

    const stockColor = agotado ? "text-red-600" : totalStock <= 5 ? "text-amber-600" : "text-green-600";

    const handleAddClick = () => {
        if (hasVariants) {
            setIsModalOpen(true);
        } else {
            addToCart(product);
            toast.success(`Agregado: ${nombre}`);
        }
    };

    return (
        <>
            <div 
                onClick={!agotado ? handleAddClick : undefined}
                className={`
                    bg-white rounded-xl border border-slate-200 shadow-sm
                    p-2 sm:p-3 flex flex-col gap-2 relative
                    transition cursor-pointer group
                    ${!agotado ? 'hover:border-blue-400 hover:shadow-md' : 'opacity-70 cursor-not-allowed'}
                `}
            >
                {/* Badge de Variantes */}
                {hasVariants && (
                    <span className="absolute top-2 left-2 z-10 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                        Variantes
                    </span>
                )}

                <div className="relative w-full h-20 sm:h-20 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    
                    {/* Botón Flotante "Add" (Visual) */}
                    {!agotado && (
                        <div className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full shadow-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                           <FaPlus size={12}/>
                        </div>
                    )}

                    {imagenes?.[0] ? (
                        <Image
                            src={imagenes[0]}
                            alt={nombre}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover"
                            loading="lazy"
                            quality={50}
                        />
                    ) : (
                        <span className="text-[10px] sm:text-xs text-slate-400">Sin imagen</span>
                    )}
                </div>

                <span className="font-medium text-slate-900 text-xs sm:text-sm line-clamp-2 min-h-[32px] leading-tight">
                    {nombre}
                </span>

                <div className="text-[10px] sm:text-xs text-slate-500 space-y-0.5 mt-auto">
                    <div>Cód: {barcode || '---'}</div>
                    <div className={stockColor}>
                        {agotado ? "Agotado" : `${totalStock} uds`}
                    </div>
                    <div className="text-blue-600 font-semibold text-xs sm:text-sm">
                        {hasVariants ? "Desde " : ""} S/ {precio.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Modal de Selección (Renderizado Condicional) */}
            {hasVariants && (
                <VariantSelectorModal 
                    product={product} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
}