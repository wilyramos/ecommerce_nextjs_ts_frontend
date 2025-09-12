"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import type { Attribute } from "@/src/schemas";
import { Range } from "react-range";

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
    const [priceValues, setPriceValues] = useState<[number, number]>([MIN, MAX]);

    useEffect(() => {
        const filters: Record<string, string[]> = {};
        attributes.forEach(attr => {
            const param = searchParams.get(attr.name);
            if (param) filters[attr.name] = param.split(",");
        });
        setSelectedFilters(filters);

        const range = searchParams.get("priceRange");
        const [min, max] = range?.split("-").map(Number) || [MIN, MAX];
        setPriceValues([min, max]);
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
            ? prevValues.filter(v => v !== value)
            : [...prevValues, value];

        setSelectedFilters({ ...selectedFilters, [attrName]: updatedValues });
        updateParams({ [attrName]: updatedValues });
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        attributes.forEach(attr => (cleared[attr.name] = null));
        setSelectedFilters({});
        setPriceValues([MIN, MAX]);
        updateParams({ ...cleared, priceRange: null, sort: null });
    };

    return (
        <aside className="py-4 border-gray-200">
            <div className="flex justify-end mb-4">
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                >
                    <MdClear size={18} />
                    Limpiar filtros
                </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>

            {/* ----- Filtro por Precio ----- */}
            <div className="mb-6">
                <h2 className="text-sm font-medium text-black mb-1">Precio</h2>
                <Range
                    step={10}
                    min={MIN}
                    max={MAX}
                    values={priceValues}
                    onChange={(values) => setPriceValues([values[0], values[1]])}
                    onFinalChange={(values) =>
                        updateParams({ priceRange: [`${values[0]}-${values[1]}`] })
                    }
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            className="w-full h-2 bg-gray-200 rounded-full"
                            style={{ padding: "0 12px" }}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props }) => {
                        const { key, ...rest } = props;
                        return (
                            <div
                                key={key}
                                {...rest}
                                className="w-4 h-4 bg-indigo-600 rounded-full shadow-md transition-transform duration-150 ease-out"
                            />
                        );
                    }}
                />
                <div className="flex justify-between text-xs text-black pt-2 px-1">
                    <span>S/ {priceValues[0]}</span>
                    <span>S/ {priceValues[1]}</span>
                </div>
            </div>

            {/* ----- Filtros por atributos con shadcn Accordion ----- */}
            <Accordion type="multiple" className="space-y-4">
                {attributes.map(attr => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger className="text-sm font-medium text-black hover:bg-gray-100 py-2 px-1 rounded-md">
                            {attr.name}
                        </AccordionTrigger>
                        <AccordionContent className="pl-2 pt-2 text-sm text-gray-600">
                            <ul className="space-y-1">
                                {attr.values.map(value => (
                                    <li
                                        key={value}
                                        className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer py-1 rounded-md"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={!!selectedFilters[attr.name]?.includes(value)}
                                            onChange={() => toggleCheckboxValue(attr.name, value)}
                                            className="accent-blue-600"
                                        />
                                        <label className="text-sm text-gray-600">{value}</label>
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
