"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import type { Attribute } from "@/src/schemas";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";

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
        <aside className="py-4 border-gray-200">
            {/* Botón limpiar filtros */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                >
                    <MdClear size={18} />
                    Limpiar filtros
                </button>
            </div>
            {/* ----- Filtro por Precio con inputs ----- */}
            <div className="mb-6">
                <h2 className="text-sm font-medium text-black mb-1">Precio</h2>
                <div
                    className="flex items-center gap-2 flex-wrap"
                >
                    {/* Input Mín */}
                    <div className="flex flex-col text-sm text-black w-full sm:w-auto">
                        <label htmlFor="min" className="mb-1">
                            Mín
                        </label>
                        <input
                            id="min"
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={(e) => handlePriceChange("min", e.target.value)}
                            className="w-full sm:w-24
          border border-gray-300 rounded 
          px-2 py-1
          focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    <span className="text-gray-500 md:mt-5">-</span>

                    {/* Input Máx */}
                    <div className="flex flex-col text-sm text-black w-full sm:w-auto">
                        <label htmlFor="max" className="mb-1">
                            Máx
                        </label>
                        <input
                            id="max"
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={(e) => handlePriceChange("max", e.target.value)}
                            className="
          w-full sm:w-24
          border border-gray-300 rounded 
          px-2 py-1
          focus:outline-none focus:ring-1 focus:ring-gray-400
        "
                        />
                    </div>
                </div>
            </div>


            {/* ----- Filtros por atributos con shadcn Accordion ----- */}
            <Accordion type="multiple" className="space-y-4">
                {attributes.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger className="text-sm font-medium text-black hover:bg-gray-100 py-2 px-2 rounded-md">
                            {attr.name}
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 pt-2 text-sm text-gray-600">
                            <ul className="space-y-1">
                                {attr.values.map((value) => (
                                    <li
                                        key={value}
                                        onClick={() => toggleCheckboxValue(attr.name, value)}
                                        className="flex items-center gap-2 hover:bg-gray-100  px-2 cursor-pointer py-1 rounded-md select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!selectedFilters[attr.name]?.includes(value)}
                                            readOnly
                                            className="accent-blue-600 pointer-events-none"
                                        />
                                        <span className="text-sm text-gray-600">{value}</span>
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
