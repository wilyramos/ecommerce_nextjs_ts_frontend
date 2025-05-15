"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoriasList } from "@/src/schemas";

export default function ProductsFilters({ categorias }: { categorias: CategoriasList }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "",
        priceRange: searchParams.get("priceRange") || "",
        brand: searchParams.get("brand") || "",
    });

    useEffect(() => {
        setFilters({
            category: searchParams.get("category") || "",
            priceRange: searchParams.get("priceRange") || "",
            brand: searchParams.get("brand") || "",
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
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
                <label className="block mb-1 font-semibold">Categoría</label>
                <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                    className="w-full border-gray-300 rounded p-2"
                >
                    {categorias.map(({ nombre, _id }) => (
                        <option key={_id} value={_id}>{nombre}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Precio</label>
                <select
                    value={filters.priceRange}
                    onChange={(e) => updateFilters({ priceRange: e.target.value })}
                    className="w-full border-gray-300 rounded p-2"
                >
                    {priceRanges.map(({ label, value }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-1 font-semibold">Marca</label>
                {/* Falta implementar marcas */}
            </div>
        </form>
    );
}
