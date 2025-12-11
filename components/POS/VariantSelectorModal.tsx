"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas"; // Ajusta tus imports
import Image from "next/image";
import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5";

interface Props {
    product: ProductWithCategoryResponse;
    isOpen: boolean;
    onClose: () => void;
}

export default function VariantSelectorModal({ product, isOpen, onClose }: Props) {
    const addToCart = useCartStore((s) => s.addToCart);
    const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(null);

    // 1. Extraer atributos únicos disponibles
    const attributesMap = useMemo(() => {
        const attrs: Record<string, Set<string>> = {};
        if (!product.variants) return {};

        product.variants.forEach((v) => {
            if (v.stock > 0 && v.atributos) { // Solo mostrar atributos de productos con stock
                Object.entries(v.atributos).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value as string);
                });
            }
        });
        return attrs;
    }, [product]);

    // 2. Encontrar variante que coincida con la selección
    useEffect(() => {
        if (!product.variants) return;
        
        // Verificar si tenemos todos los atributos necesarios seleccionados
        const requiredKeys = Object.keys(attributesMap);
        const hasAllKeys = requiredKeys.every(key => selectedAttrs[key]);

        if (hasAllKeys) {
            const found = product.variants.find((v) => {
                return Object.entries(selectedAttrs).every(
                    ([key, val]) => v.atributos && v.atributos[key] === val
                );
            });
            setSelectedVariant((found as unknown as VariantCart) || null);
        } else {
            setSelectedVariant(null);
        }
    }, [selectedAttrs, product.variants, attributesMap]);

    // 3. Pre-seleccionar primera opción si es posible
    useEffect(() => {
        if(isOpen) {
             setSelectedAttrs({});
             setSelectedVariant(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        addToCart(product, selectedVariant);
        toast.success(`Agregado: ${product.nombre} - ${Object.values(selectedVariant.atributos).join("/")}`);
        onClose();
    };

    const currentPrice = selectedVariant?.precio ?? product.precio;
    const currentStock = selectedVariant?.stock ?? 0;
    const currentImage = selectedVariant?.imagenes?.[0] ?? product.imagenes?.[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800">Seleccionar Variante</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto flex-1 space-y-4">
                    
                    {/* Preview */}
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                           {currentImage && (
                                <Image src={currentImage} alt="Preview" width={80} height={80} className="object-cover w-full h-full"/>
                           )}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{product.nombre}</p>
                            <p className="text-xl font-bold text-blue-600 mt-1">S/ {currentPrice.toFixed(2)}</p>
                            <p className={`text-xs mt-1 ${currentStock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                Stock: {selectedVariant ? currentStock : '--'}
                            </p>
                        </div>
                    </div>

                    {/* Selectores Dinámicos */}
                    {Object.keys(attributesMap).map((attrKey) => (
                        <div key={attrKey}>
                            <p className="text-sm font-medium text-gray-700 mb-2 capitalize">{attrKey}</p>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(attributesMap[attrKey]).map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setSelectedAttrs(prev => ({ ...prev, [attrKey]: val }))}
                                        className={`
                                            px-3 py-1.5 text-sm rounded-md border transition-all
                                            ${selectedAttrs[attrKey] === val 
                                                ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}
                                        `}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || currentStock <= 0}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {currentStock <= 0 && selectedVariant ? "Sin Stock" : "AGREGAR A VENTA"}
                    </button>
                </div>
            </div>
        </div>
    );
}