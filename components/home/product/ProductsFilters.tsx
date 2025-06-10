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
        brand: "",
        color: "",
        compatibilidad: "",
    });

    useEffect(() => {
        setFilters({
            category: searchParams.get("category") || "",
            priceRange: searchParams.get("priceRange") || "",
            brand: searchParams.get("brand") || "",
            color: searchParams.get("color") || "",
            compatibilidad: searchParams.get("compatibilidad") || "",
        });
    }, [searchParams]);

    const updateFilters = (newFilters: { category?: string; priceRange?: string; brand?: string; color?: string; compatibilidad?: string }) => {
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

    const brands = [
        { label: "Todas", value: "" },
        { label: "Samsung", value: "samsung" },
        { label: "Apple", value: "apple" },
        { label: "Ifans", value: "ifans" },
        { label: "1HORA", value: "1hora" },
    ];

    const colorOptions = [
        { label: "Todos", value: "" },
        { label: "Negro", value: "negro" },
        { label: "Blanco", value: "blanco" },
        { label: "Rojo", value: "rojo" },
        { label: "Azul", value: "azul" },
    ];

    const compatibilidadOptions = [
        { label: "Todos", value: "" },

        { label: "iPhone 14", value: "iphone-14" },
        { label: "iPhone 13 Pro", value: "iphone-13-pro" },
        { label: "iPhone 13", value: "iphone-13" },
        { label: "iPhone 12", value: "iphone-12" },
        { label: "iPhone 11", value: "iphone-11" },
    ];

    return (
        <aside className="py-6 border-gray-100">
            <div className="flex items-center justify-end">
                <button
                    onClick={() => updateFilters({ category: "", priceRange: "", brand: "", color: "", compatibilidad: "" })}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs"
                >
                    <MdClear size={18} className="text-red-500" />
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
                        {categorias.map(({ nombre, slug }) => (
                            <option key={slug} value={slug}>{nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Precio */}
                <div className="space-y-1">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Precio</h4>
                        <ul className="space-y-1">
                            {priceRanges.map(({ label, value }) => (
                                <li key={value} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        value={value}
                                        checked={filters.priceRange === value}
                                        onChange={() => updateFilters({ priceRange: value })}
                                        className="accent-gray-700"
                                    />
                                    <label className="text-sm text-gray-600">{label}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <select
                        value={filters.brand}
                        onChange={(e) => updateFilters({ brand: e.target.value })}
                        className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm bg-white"
                    >
                        {brands.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <select
                        value={filters.color}
                        onChange={(e) => updateFilters({ color: e.target.value })}
                        className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm bg-white"
                    >
                        {colorOptions.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Compatibilidad</label>
                    <select
                        value={filters.compatibilidad}
                        onChange={(e) => updateFilters({ compatibilidad: e.target.value })}
                        className="p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-sm bg-white"
                    >
                        {compatibilidadOptions.map(({ label, value }) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                
            </form>
        </aside>
    );
}