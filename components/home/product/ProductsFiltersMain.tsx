"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TFilter } from "@/src/schemas";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { LuListFilter } from "react-icons/lu";
import { useState, useEffect } from "react";

type ProductsFiltersProps = {
    filters: TFilter[] | null;
};

export default function ProductsFiltersMain({ filters }: ProductsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { brands = [], atributos = [], price = [] } = filters?.[0] ?? {};
    const priceFilter = price?.[0] ?? null;

    // --- ordenamiento seguro ---
    const sortedCategories =
        filters?.[0]?.categories
            ?.slice()
            .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" })) ?? [];

    const sortedBrands =
        brands
            .slice()
            .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" }));

    const sortedAtributos = atributos
        .slice()
        .map((attr) => ({
            ...attr,
            values: attr.values
                .slice()
                .sort((a, b) =>
                    a.localeCompare(b, undefined, { sensitivity: "base" })
                ),
        }))
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    // --- price range ---
    const [priceRange, setPriceRange] = useState<[number, number]>([
        priceFilter?.min ?? 0,
        priceFilter?.max ?? 0,
    ]);

    useEffect(() => {
        if (!priceFilter) return;
        const paramRange = searchParams.get("priceRange");
        if (paramRange) {
            const [min, max] = paramRange.split("-").map(Number);
            setPriceRange([
                min || priceFilter.min || 0,
                max || priceFilter.max || 0,
            ]);
        } else {
            setPriceRange([priceFilter.min ?? 0, priceFilter.max ?? 0]);
        }
    }, [searchParams, priceFilter]);

    if (!filters || filters.length === 0) return null;

    const updatePriceRange = (range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceRange", `${range[0]}-${range[1]}`);
        params.set("page", "1"); // reset page on filter change
        router.push(`/productos?${params.toString()}`);
    };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.getAll(key).includes(value)) {
            const newValues = params.getAll(key).filter((v) => v !== value);
            params.delete(key);
            newValues.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }
        params.set("page", "1"); // reset page on filter change
        router.push(`/productos?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        const query = searchParams.get("query");
        if (query) params.set("query", query);
        router.push(`/productos?${params.toString()}`);
    };

    return (
        <aside className="w-full shadow-xs rounded-xs bg-white">
            <div className="flex justify-between items-center mb-3 bg-black rounded-t-md">
                <h2 className="text-lg flex items-center gap-2 px-4 py-2 font-semibold text-white">
                    <LuListFilter />
                    Filtros
                </h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-200 underline px-4 cursor-pointer hover:text-white transition-colors"
                >
                    Limpiar
                </button>
            </div>

            <Accordion type="multiple" className="w-full text-sm px-4">

                {/* Categorías */}
                {sortedCategories.length > 0 && (
                    <AccordionItem value="categories">
                        <AccordionTrigger className="text-sm font-light">Categorías</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {sortedCategories.map((category) => (
                                    <li key={category.slug}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll("category").includes(category.slug)}
                                                onChange={() =>
                                                    handleFilterChange("category", category.slug)
                                                }
                                            />
                                            {category.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Marcas */}
                {sortedBrands.length > 0 && (
                    <AccordionItem value="brands">
                        <AccordionTrigger className="text-sm font-light ">Marcas</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {sortedBrands.map((brand) => (
                                    <li key={brand.slug}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll("brand").includes(brand.slug)}
                                                onChange={() =>
                                                    handleFilterChange("brand", brand.slug)
                                                }
                                            />
                                            {brand.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Atributos dinámicos */}
                {sortedAtributos.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger className="text-sm font-light capitalize">
                            {attr.name}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {attr.values.map((value) => (
                                    <li key={value}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
                                            <input
                                                type="checkbox"
                                                checked={searchParams
                                                    .getAll(attr.name)
                                                    .includes(value)}
                                                onChange={() =>
                                                    handleFilterChange(attr.name, value)
                                                }
                                            />
                                            {value}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* Precio */}
                {priceFilter && (
                    <AccordionItem value="price">
                        <AccordionTrigger className="text-sm font-light">
                            Precio
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4 text-sm p-2">
                                <Slider
                                    min={priceFilter.min ?? 0}
                                    max={priceFilter.max ?? 1000}
                                    step={2}
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange(val as [number, number])}
                                    onValueCommit={(val) =>
                                        updatePriceRange(val as [number, number])
                                    }
                                />
                                <div className="flex justify-between text-gray-500">
                                    <span>S/. {priceRange[0]}</span>
                                    <span>S/. {priceRange[1]}</span>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </aside>
    );
}
