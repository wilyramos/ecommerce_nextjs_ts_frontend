"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import type { CategoriasList } from "@/src/schemas";
import { MdDelete } from "react-icons/md";

export default function ProductsFilters({ categorias }: { categorias: CategoriasList }) {
    
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "",
        priceRange: searchParams.get("priceRange") || "",
    });

    useEffect(() => {
        setFilters({
            category: searchParams.get("category") || "",
            priceRange: searchParams.get("priceRange") || "",
        });
    }, [searchParams]);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        router.push(`?${params.toString()}`);
    };

    const priceRanges = [
        { label: "Todos", value: "" },
        { label: "0 - 100", value: "0-100" },
        { label: "100 - 300", value: "100-300" },
        { label: "300 - 1000", value: "300-1000" },
    ];

    return (
        <div className="p-6 space-y-6 ">
            <div className="flex justify-between items-center">
                <button
                    onClick={() => updateFilters({ category: "", priceRange: "" })}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition group"
                >
                    <MdDelete size={18} className="group-hover:text-red-500" />
                    Limpiar
                </button>
            </div>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        value={filters.category}
                        onChange={(e) => updateFilters({ category: e.target.value })}
                        className="p-2 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                    >
                        {categorias.map(({ nombre, _id }) => (
                            <option key={_id} value={_id}>{nombre}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => updateFilters({ priceRange: e.target.value })}
                        className="p-2 w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                    >
                        {priceRanges.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Marca</label>
                    <div className="w-full rounded-lg border border-dashed border-gray-300 p-2 text-center text-gray-400 text-sm">
                        Próximamente
                    </div>
                </div>
            </form>
        </div>
    );
}
