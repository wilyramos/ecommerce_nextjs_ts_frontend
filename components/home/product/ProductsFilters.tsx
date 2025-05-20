"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoriasList } from "@/src/schemas";
import { MdClear } from "react-icons/md";

export default function ProductsFilters({ categorias }: { categorias: CategoriasList }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        category: "",
        priceRange: "",
    });

    useEffect(() => {
        setFilters({
            category: searchParams.get("category") || "",
            priceRange: searchParams.get("priceRange") || "",
        });
    }, [searchParams]);

    const updateFilters = (newFilters: { category?: string; priceRange?: string }) => {
        const updatedFilters = { ...filters, ...newFilters };
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`/productos?${params.toString()}`);
    };

    const priceRanges = [
        { label: "Todos", value: "" },
        { label: "0 - 100", value: "0-100" },
        { label: "100 - 300", value: "100-300" },
        { label: "300 - 1000", value: "300-1000" },
    ];

    return (
        <aside className="py-6 border-gray-100">
            <div className="flex items-center justify-end">
                <button
                    onClick={() => updateFilters({ category: "", priceRange: "" })}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition text-xs"
                >
                    <MdClear size={18} className="text-red-500"/>
                    Limpiar filtros
                </button>
            </div>

            <form className="space-y-5">
                {/* Categoría */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                        value={filters.category}
                        onChange={(e) => updateFilters({ category: e.target.value })}
                        className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm bg-white"
                    >
                        <option value="">Todas</option>
                        {categorias.map(({ nombre, _id }) => (
                            <option key={_id} value={_id}>{nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Precio */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => updateFilters({ priceRange: e.target.value })}
                        className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm bg-white"
                    >
                        {priceRanges.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                {/* Marca (placeholder) */}
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-400">Marca</label>
                    <div className="w-full rounded-lg border border-dashed border-gray-300 p-3 text-center text-gray-400 text-sm bg-gray-50">
                        Próximamente
                    </div>
                </div>
            </form>
        </aside>
    );
}
