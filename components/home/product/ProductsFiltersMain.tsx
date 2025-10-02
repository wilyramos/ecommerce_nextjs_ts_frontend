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
import { Button } from "@/components/ui/button";

type ProductsFiltersProps = {
    filters: TFilter[] | null;
};

export default function ProductsFiltersMain({ filters }: ProductsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // inicializa datos aunque filters sea null
    const { brands = [], atributos = [], price = [] } = filters?.[0] ?? {};
    const priceFilter = price?.[0] ?? null;

    // hooks SIEMPRE al inicio
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

    // si no hay filtros, retorno temprano después de hooks
    if (!filters || filters.length === 0) return null;

    const updatePriceRange = (range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceRange", `${range[0]}-${range[1]}`);
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
        router.push(`/productos?${params.toString()}`);
    };

    // función para limpiar todos los filtros menos el query de búsqueda
    const clearFilters = () => {
        const params = new URLSearchParams();
        const query = searchParams.get("query");
        if (query) {
            params.set("query", query);
        }
        router.push(`/productos?${params.toString()}`);
    };

    return (
        <aside className="w-full p-4 border border-gray-100 shadow-xs rounded-md bg-white">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <LuListFilter className="text-gray-600" />
                    Filtros
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-red-600 hover:text-red-500"
                >
                    Limpiar
                </Button>
            </div>

            <Accordion type="multiple" className="w-full">
                {/* Brands */}
                {brands.length > 0 && (
                    <AccordionItem value="brands">
                        <AccordionTrigger>Marcas</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {brands.map((brand) => (
                                    <li key={brand.slug}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll("brand").includes(brand.slug)}
                                                onChange={() => handleFilterChange("brand", brand.slug)}
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
                {atributos.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger className="capitalize">{attr.name}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {attr.values.map((value) => (
                                    <li key={value}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll(attr.name).includes(value)}
                                                onChange={() => handleFilterChange(attr.name, value)}
                                            />
                                            {value}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}

                {/* Precio dinámico con slider */}
                {priceFilter && (
                    <AccordionItem value="price">
                        <AccordionTrigger>Precio</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-4 text-sm p-2">
                                <Slider
                                    min={priceFilter.min ?? 0}
                                    max={priceFilter.max ?? 1000}
                                    step={2}
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange(val as [number, number])}
                                    onValueCommit={(val) => updatePriceRange(val as [number, number])}
                                />
                                <div className="flex justify-between text-gray-600">
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
