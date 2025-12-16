"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdFilterListOff } from "react-icons/md";
import type { Attribute } from "@/src/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type Props = {
    categorySlug: string;
    attributes: Attribute[];
};

const MIN = 0;
const MAX = 3000;

export default function FiltrosClient({ categorySlug, attributes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [minPrice, setMinPrice] = useState<number>(MIN);
    const [maxPrice, setMaxPrice] = useState<number>(MAX);

    // --- Cargar valores iniciales desde la URL ---
    useEffect(() => {
        const filters: Record<string, string[]> = {};
        attributes.forEach((attr) => {
            const param = searchParams.get(attr.name);
            if (param) filters[attr.name] = param.split(",");
        });
        setSelectedFilters(filters);

        const range = searchParams.get("priceRange");
        if (range) {
            const [min, max] = range.split("-").map(Number);
            setMinPrice(min);
            setMaxPrice(max);
        } else {
            setMinPrice(MIN);
            setMaxPrice(MAX);
        }
    }, [searchParams, attributes]);

    const updateParams = (updates: Record<string, string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, val] of Object.entries(updates)) {
            if (!val || val.length === 0) params.delete(key);
            else params.set(key, val.join(","));
        }
        router.push(`/categoria/${categorySlug}?${params.toString()}`);
    };

    const toggleCheckboxValue = (attrName: string, value: string) => {
        const prevValues = selectedFilters[attrName] || [];
        const updatedValues = prevValues.includes(value)
            ? prevValues.filter((v) => v !== value)
            : [...prevValues, value];

        setSelectedFilters({ ...selectedFilters, [attrName]: updatedValues });
        updateParams({ [attrName]: updatedValues });
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        attributes.forEach((attr) => (cleared[attr.name] = null));
        setSelectedFilters({});
        setMinPrice(MIN);
        setMaxPrice(MAX);
        updateParams({ ...cleared, priceRange: null, sort: null });
    };

    // --- Manejar cambios en inputs de precio ---
    const handlePriceChange = (type: "min" | "max", value: string) => {
        const number = Number(value);
        if (type === "min") {
            setMinPrice(number);
            updateParams({ priceRange: [`${number}-${maxPrice}`] });
        } else {
            setMaxPrice(number);
            updateParams({ priceRange: [`${minPrice}-${number}`] });
        }
    };

    return (
        <aside className="p-4 ">
            {/* Botón limpiar filtros */}
            <div className="flex justify-end mb-4">
                

                  <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-red-500"
                    >
                        <MdFilterListOff className="mr-2 h-4 w-4" />
                        Limpiar
                    </Button>
            </div>
            {/* ----- Filtro por Precio con inputs ----- */}
            <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-800 mb-1">Precio</h2>
                <div
                    className="flex flex-row gap-2 "
                >
                    {/* Input Mín */}
                    <div className="flex flex-col text-sm text-gray-800 w-full sm:w-auto px-4">
                        <Label htmlFor="min" className="mb-1 text-xs font-semibold">
                            Mín
                        </Label>
                        <Input
                            id="min"
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={(e) => handlePriceChange("min", e.target.value)}
                        />
                    </div>

                    <span className="text-gray-8000 md:mt-5">-</span>

                    {/* Input Máx */}
                    <div className="flex flex-col text-sm text-gray-800 w-full sm:w-auto">
                        <Label htmlFor="max" className="mb-1 text-xs font-semibold">
                            Máx
                        </Label>
                        <Input
                            id="max"
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={(e) => handlePriceChange("max", e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* ----- Filtros por atributos con shadcn Accordion ----- */}
            <Accordion type="multiple" className="space-y-4 ">
                {attributes.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger
                            className="text-sm font-semibold text-zinc-800 hover:bg-zinc-200 py-2 px-2 cursor-pointer select-none"
                        >
                            {attr.name.charAt(0).toUpperCase() + attr.name.slice(1).toLowerCase()}
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 pt-2 text-sm text-gray-800">
                            <ul className="space-y-1">
                                {attr.values.map((value) => (
                                    <li
                                        key={value}
                                        onClick={() => toggleCheckboxValue(attr.name, value)}
                                        className="flex items-center gap-2 hover:bg-zinc-200 px-2 cursor-pointer py-1  select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!selectedFilters[attr.name]?.includes(value)}
                                            readOnly
                                            className="accent-blue-600 pointer-events-none"
                                        />
                                        <span className="text-sm text-gray-800">{value}</span>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </aside>
    );
}
