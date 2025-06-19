"use client";

import { useState, useEffect } from "react";
import type { CategoriasList } from "@/src/schemas";


type Props = {
    categorias: CategoriasList;
    initialCategoryId?: string;
    currentVariants?: { name: string; values: string[] }[];
};


export default function ClientCategoryVariants({ categorias, initialCategoryId, currentVariants }: Props) {
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
    const [variantOptions, setVariantOptions] = useState([]);

    

    return (
        <div>
            <h3 className="font-semibold text-gray-700">Variantes de la categoría</h3>
            <div className="mt-2">
                
            </div>
        </div>
    )
}
