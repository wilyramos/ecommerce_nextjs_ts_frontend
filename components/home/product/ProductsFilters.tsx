"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoriasList } from "@/src/schemas";
import { MdClear } from "react-icons/md";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

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

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`/productos?${params.toString()}`);
    };

    const sections = [
        {
            title: "Categoría",
            content: (
                <ul className="space-y-1">
                    {categorias.map((categoria) => (
                        <li key={categoria.slug} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="category"
                                value={categoria.slug}
                                checked={filters.category === categoria.slug}
                                onChange={() => updateFilters({ category: categoria.slug })}
                                className="accent-blue-600"
                            />
                            <label className="text-sm text-gray-600">{categoria.nombre}</label>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Precio",
            content: (
                <ul className="space-y-1">
                    {[
                        { label: "Todos", value: "" },
                        { label: "0 - 100", value: "0-100" },
                        { label: "100 - 300", value: "100-300" },
                        { label: "300 - 1000", value: "300-1000" },
                    ].map(({ label, value }) => (
                        <li key={value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="priceRange"
                                value={value}
                                checked={filters.priceRange === value}
                                onChange={() => updateFilters({ priceRange: value })}
                                className="accent-blue-600"
                            />
                            <label className="text-sm text-gray-600">{label}</label>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Marca",
            content: (
                <ul className="space-y-1">
                    {[
                        { label: "Todas", value: "" },
                        { label: "Apple", value: "apple" },
                        { label: "Samsung", value: "samsung" },
                        { label: "Xiaomi", value: "xiaomi" },
                        { label: "Huawei", value: "huawei" },
                    ].map(({ label, value }) => (
                        <li key={value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="brand"
                                value={value}
                                checked={filters.brand === value}
                                onChange={() => updateFilters({ brand: value })}
                                className="accent-blue-600"
                            />
                            <label className="text-sm text-gray-600">{label}</label>
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: "Color",
            content: (
                <ul className="space-y-1">
                    {[
                        { label: "Todos", value: "" },
                        { label: "Negro", value: "negro" },
                        { label: "Blanco", value: "blanco" },
                        { label: "Rojo", value: "rojo" },
                        { label: "Azul", value: "azul" },
                    ].map(({ label, value }) => (
                        <li key={value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="color"
                                value={value}
                                checked={filters.color === value}
                                onChange={() => updateFilters({ color: value })}
                                className="accent-blue-600"
                            />
                            <label className="text-sm text-gray-600">{label}</label>
                        </li>
                    ))}
                </ul>

            ),
        },
        {
            title: "Compatibilidad",
            content: (
                <ul className="space-y-1">
                    {[
                        { label: "Todos", value: "" },
                        { label: "Iphone 16", value: "iphone-16" },
                        { label: "Iphone 15 pro max", value: "iphone-15-pro-max" },
                        { label: "Iphone 15 pro", value: "iphone-15-pro" },
                        { label: "Iphone 15", value: "iphone-15" },
                        { label: "Iphone 14 pro max", value: "iphone-14-pro-max" },
                        { label: "Iphone 14 pro", value: "iphone-14-pro" },
                        { label: "Iphone 14", value: "iphone-14" },
                        { label: "Iphone 13 pro max", value: "iphone-13-pro-max" },
                        { label: "Iphone 13 pro", value: "iphone-13-pro" },
                        { label: "Iphone 13", value: "iphone-13" },
                        { label: "Iphone 12 pro max", value: "iphone-12-pro-max" },
                        { label: "Iphone 12 pro", value: "iphone-12-pro" },
                        { label: "Iphone 12", value: "iphone-12" },
                        { label: "Iphone 11 pro max", value: "iphone-11-pro-max" },
                        { label: "Iphone 11 pro", value: "iphone-11-pro" },
                        { label: "Iphone 11", value: "iphone-11" },
                    ].map(({ label, value }) => (
                        <li key={value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="compatibilidad"
                                value={value}
                                checked={filters.compatibilidad === value}
                                onChange={() => updateFilters({ compatibilidad: value })}
                                className="accent-blue-600"
                            />
                            <label className="text-sm text-gray-600">{label}</label>
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <aside className="py-6 border-gray-200">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => updateFilters({ category: "", priceRange: "", brand: "", color: "", compatibilidad: "" })}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs"
                >
                    <MdClear size={18} />
                    Limpiar filtros
                </button>
            </div>

            <div className="space-y-4">
                {sections.map(({ title, content }) => (
                    <Disclosure key={title}>
                        {({ open }) => (
                            <div>
                                <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700 border-b py-2">
                                    <span>{title}</span>
                                    <ChevronUpIcon className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`} />
                                </Disclosure.Button>
                                <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                    {content}
                                </Disclosure.Panel>
                            </div>
                        )}
                    </Disclosure>
                ))}
            </div>
        </aside>
    );
}