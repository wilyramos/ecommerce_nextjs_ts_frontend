"use client";

import type { ProductResponse } from "@/src/schemas";
import { usePurchaseStore } from "@/src/store/purchaseStore";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ProductResultsPurchaseProps {
    dataProducts?: ProductResponse[];
}

export default function ProductResultsPurchase({ dataProducts }: ProductResultsPurchaseProps) {
    const addItem = usePurchaseStore((state) => state.addItem);
    const [visible, setVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dataProducts && dataProducts.length > 0) setVisible(true);
    }, [dataProducts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddProduct = (product: ProductResponse) => {
        addItem({
            productId: product._id,
            nombre: product.nombre,
            costo: product.costo || 0,
            cantidad: 1,
            imagen: product.imagenes?.[0] || "",
        });
        setVisible(false);
    };

    if (!dataProducts || dataProducts.length === 0 || !visible) return null;

    return (
        <div ref={containerRef} className="relative mt-1 w-full max-w-3xl mx-auto">
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-auto">
                {dataProducts.map((product) => (
                    <li
                        key={product._id}
                        onClick={() => handleAddProduct(product)}
                        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        {/* Imagen */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                            {product.imagenes && product.imagenes.length > 0 ? (
                                <Image
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                    quality={20}
                                />
                            ) : (
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-200">
                                    <span className="text-xs text-gray-400">Sin imagen</span>
                                </div>
                            )}
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                            <div className="font-medium text-gray-800">{product.nombre}</div>
                            <div className="text-xs text-gray-500">SKU: {product.sku || "-"}
                            {"-"}
                            Barcode: {product.barcode || "-"}
                            </div>
                            <div className="text-xs text-gray-500">Costo: s/{product.costo?.toFixed(2) || "0.00"}</div>
                            <div className="text-xs text-gray-500 font-semibold">Precio: s/{product.precio?.toFixed(2) || "0.00"}</div>
                            <div className="text-xs ">
                                Stock: 
                                { product.stock !== undefined ? (
                                    <span className={`font-semibold ml-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock}
                                    </span>
                                ) : (
                                    <span className="font-semibold ml-1 text-gray-500">-</span>
                                )
                                }
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
