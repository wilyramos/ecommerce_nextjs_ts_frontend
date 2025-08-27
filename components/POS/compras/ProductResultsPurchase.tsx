"use client";

import type { ProductResponse } from "@/src/schemas";
import { usePurchaseStore } from "@/src/store/purchaseStore";
import { useEffect, useState } from "react";

interface ProductResultsPurchaseProps {
    dataProducts?: ProductResponse[];
}

export default function ProductResultsPurchase({ dataProducts }: ProductResultsPurchaseProps) {
    const addItem = usePurchaseStore((state) => state.addItem);

    const [ visible, setVisible ] = useState(true);

    useEffect(() => {
        if (dataProducts && dataProducts.length > 0) {
            setVisible(true);
        }
    }, [dataProducts]);

    const handleAddProduct = (product: ProductResponse) => {
        addItem({
            _id: product._id,
            nombre: product.nombre,
            precio: product.precio || 0,
            cantidad: 1,
            imagen: product.imagenes ? product.imagenes[0] || "" : "",
        });
        setVisible(false);
    };

    if (!dataProducts || dataProducts.length === 0 || !visible) return null;

    return (
        <div className="relative mt-1 w-full">
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {dataProducts.map((product) => (
                    <li
                        key={product._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleAddProduct(product)}
                    >
                        <div className="font-medium">{product.nombre}</div>
                        <div className="text-sm text-gray-500">{product.sku}</div>

                    </li>
                ))}
            </ul>
        </div>
    );
}
