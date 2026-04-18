/* File: src/components/pos/ProductCard.tsx */
"use client";

import { useState } from 'react';
import { Product, ProductVariant } from "@/src/schemas/product.schema";
import { usePosStore } from '@/src/store/usePosStore';
import { Smartphone, Layers, X } from "lucide-react";
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const ProductCard = ({ product }: { product: Product }) => {
    const addToCart = usePosStore((state) => state.addToCart);
    const [showVariants, setShowVariants] = useState(false);

    const hasVariants = product.variants && product.variants.length > 0;
    const stock = product.stock ?? 0;
    const hasStock = stock > 0 || (hasVariants && product.variants!.some(v => v.stock > 0));

    const handleMainClick = () => {
        if (!hasStock) return;
        if (hasVariants) {
            setShowVariants(true);
        } else {
            addToCart(product);
        }
    };

    const selectVariant = (v: ProductVariant) => {
        if (v.stock <= 0) return;
        addToCart(product, v);
        setShowVariants(false);
    };

    return (
        <div className="relative h-full">
            <div 
                onClick={handleMainClick}
                className={cn(
                    "group bg-white  border-2 border-transparent p-4 transition-all duration-300 shadow-sm flex flex-col h-full",
                    hasStock ? "hover:border-black cursor-pointer active:scale-[0.97]" : "opacity-60 grayscale cursor-not-allowed"
                )}
            >
                {/* IMAGEN Y BADGES */}
                <div className="relative aspect-square flex items-center justify-center mb-4 overflow-hidden">
                    {product.imagenes?.[0] ? (
                        <Image
                            src={product.imagenes[0]}
                            alt={product.nombre}
                            width={200}
                            height={200}
                            unoptimized
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <Smartphone size={32} className="text-slate-200" />
                    )}
                    
                    {hasVariants && (
                        <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded-lg flex items-center gap-1">
                            <Layers size={10} />
                            <span className="text-[8px] font-black uppercase">{product.variants?.length} Variantes</span>
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-xs font-black uppercase text-slate-900 leading-tight">{product.nombre}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                        {typeof product.categoria === 'object' ? product.categoria.nombre : 'General'}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <span className="text-sm font-black text-black">S/ {product.precio?.toFixed(2)}</span>
                    <div className={cn(
                        "text-[8px] font-black px-2 py-1 rounded-lg uppercase",
                        hasStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                    )}>
                        {hasStock ? 'Disponible' : 'Sin Stock'}
                    </div>
                </div>
            </div>

            {/* OVERLAY DE VARIANTES (Industrial UX) */}
            {showVariants && (
                <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm  p-4 flex flex-col animate-in fade-in zoom-in duration-200 border-2 border-black">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase">Seleccionar Variante</span>
                        <button onClick={() => setShowVariants(false)} className="p-1 hover:bg-slate-100 rounded-full">
                            <X size={14} />
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {product.variants?.map((v) => (
                            <button
                                key={v._id?.toString()}
                                disabled={v.stock <= 0}
                                onClick={() => selectVariant(v)}
                                className={cn(
                                    "w-full p-2 border flex items-center justify-between transition-all",
                                    v.stock > 0 ? "hover:border-black bg-white" : "opacity-40 bg-slate-50 cursor-not-allowed"
                                )}
                            >
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase leading-none">{v.nombre || 'Variante'}</p>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1">Stock: {v.stock}</p>
                                </div>
                                <span className="text-[10px] font-black">S/ {v.precio?.toFixed(2)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};