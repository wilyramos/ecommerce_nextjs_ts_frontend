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
import { LuListFilter, LuX } from "react-icons/lu"; // Cambié icono de limpiar
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Asumiendo que tienes esta utilidad, sino usa string templates

type ProductsFiltersProps = {
    filters: TFilter[] | null;
};

export default function ProductsFiltersMain({ filters }: ProductsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { brands = [], atributos = [], price = [] } = filters?.[0] ?? {};
    const priceFilter = price?.[0] ?? null;

    // --- Ordenamiento seguro ---
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

    // --- Price range state ---
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

    // --- Handlers ---
    const updatePriceRange = (range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceRange", `${range[0]}-${range[1]}`);
        params.set("page", "1");
        router.push(`/productos?${params.toString()}`, { scroll: false });
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
        params.set("page", "1");
        router.push(`/productos?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        const query = searchParams.get("query");
        if (query) params.set("query", query);
        router.push(`/productos?${params.toString()}`);
    };

    const hasActiveFilters = Array.from(searchParams.keys()).some(
        (key) => key !== "page" && key !== "query" && key !== "sort"
    );

    // --- Render Helpers ---
    const FilterCheckboxItem = ({
        label,
        checked,
        onChange
    }: { label: string, checked: boolean, onChange: () => void }) => (
        <li className="group">
            <label className={cn(
                "flex items-center gap-3 cursor-pointer py-1.5 px-2 rounded-md transition-all",
                "hover:bg-gray-50",
                checked ? "text-gray-900 font-medium bg-gray-50" : "text-gray-600"
            )}>
                <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black transition-colors"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="text-sm select-none">{label}</span>
            </label>
        </li>
    );

    return (
        <aside className="w-full h-fit lg:sticky lg:top-24 space-y-4 pt-2">
            {/* Header */}
            <div className="flex justify-between items-center px-1 pb-2 border-b border-gray-100">
                <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2 text-gray-900">
                    <LuListFilter className="w-4 h-4" />
                    Filtros
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors font-medium"
                    >
                        Limpiar <LuX className="w-3 h-3" />
                    </button>
                )}
            </div>

            <Accordion
                type="multiple"
                defaultValue={["categories", "price"]}
                className="w-full"
            >
                {/* Categorías */}
                {sortedCategories.length > 0 && (
                    <AccordionItem value="categories" className="border-b-gray-100">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {sortedCategories.map((category) => (
                                    <FilterCheckboxItem
                                        key={category.slug}
                                        label={category.nombre}
                                        checked={searchParams.getAll("category").includes(category.slug)}
                                        onChange={() => handleFilterChange("category", category.slug)}
                                    />
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Precio */}
                {priceFilter && (
                    <AccordionItem value="price" className="border-b-gray-100">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                            Precio
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-6 px-1">
                            <Slider
                                min={priceFilter.min ?? 0}
                                max={priceFilter.max ?? 1000}
                                step={5}
                                value={priceRange}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                onValueCommit={(val) => updatePriceRange(val as [number, number])}
                                className="my-4"
                            />
                            <div className="flex justify-between items-center mt-4">
                                <div className="border border-gray-200 rounded px-3 py-1 bg-gray-50 text-sm text-gray-700 font-medium">
                                    S/. {priceRange[0]}
                                </div>
                                <span className="text-gray-400 text-xs uppercase">a</span>
                                <div className="border border-gray-200 rounded px-3 py-1 bg-gray-50 text-sm text-gray-700 font-medium">
                                    S/. {priceRange[1]}
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Marcas */}
                {sortedBrands.length > 0 && (
                    <AccordionItem value="brands" className="border-b-gray-100">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent>
                            {/* Scroll area para marcas si son muchas */}
                            <ul className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {sortedBrands.map((brand) => (
                                    <FilterCheckboxItem
                                        key={brand.slug}
                                        label={brand.nombre}
                                        checked={searchParams.getAll("brand").includes(brand.slug)}
                                        onChange={() => handleFilterChange("brand", brand.slug)}
                                    />
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Atributos dinámicos */}
                {sortedAtributos.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name} className="border-b-gray-100">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3 capitalize">
                            {attr.name}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-0.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {attr.values.map((value) => (
                                    <FilterCheckboxItem
                                        key={value}
                                        label={value}
                                        checked={searchParams.getAll(attr.name).includes(value)}
                                        onChange={() => handleFilterChange(attr.name, value)}
                                    />
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </aside>
    );
}