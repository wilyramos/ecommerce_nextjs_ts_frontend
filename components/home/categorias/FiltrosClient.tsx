"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdFilterListOff } from "react-icons/md";
import type { Attribute } from "@/src/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ColorCircle from "@/components/ui/ColorCircle";

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
        <aside className="p-4 rounded-lg bg-[var(--store-surface)] text-[var(--store-text)] border border-[var(--store-border)]">

            <h2 className="text-xl font-light leading-6 mb-4 text-[var(--store-text)]">
                Productos en {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}
            </h2>
            <div className="flex justify-end mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-xs text-[var(--store-text-muted)] hover:text-red-500"
                >
                    <MdFilterListOff className="mr-2 h-4 w-4" />
                    Limpiar
                </Button>
            </div>

            <div className="mb-4">
                <h2 className="text-sm font-semibold text-[var(--store-text)] mb-1">
                    Precio
                </h2>

                <div className="flex flex-row gap-2">
                    <div className="flex flex-col text-sm w-full sm:w-auto px-4">
                        <Label
                            htmlFor="min"
                            className="mb-1 text-xs font-semibold text-[var(--store-text)]"
                        >
                            Mín
                        </Label>
                        <Input
                            id="min"
                            type="number"
                            min={0}
                            value={minPrice}
                            onChange={(e) =>
                                handlePriceChange("min", e.target.value)
                            }
                            className="border-[var(--store-border)]"
                        />
                    </div>

                    <span className="md:mt-5 text-[var(--store-text)]">-</span>

                    <div className="flex flex-col text-sm w-full sm:w-auto">
                        <Label
                            htmlFor="max"
                            className="mb-1 text-xs font-semibold text-[var(--store-text)]"
                        >
                            Máx
                        </Label>
                        <Input
                            id="max"
                            type="number"
                            min={0}
                            value={maxPrice}
                            onChange={(e) =>
                                handlePriceChange("max", e.target.value)
                            }
                            className="border-[var(--store-border)]"
                        />
                    </div>
                </div>
            </div>

            <Accordion type="multiple" className="space-y-4">
                {attributes.map((attr) => {
                    const isColorAttribute =
                        attr.name.toLowerCase() === "color";

                    return (
                        <AccordionItem key={attr.name} value={attr.name}>
                            <AccordionTrigger className="text-sm font-semibold py-2 px-2 cursor-pointer select-none text-[var(--store-text)]">
                                {attr.name.charAt(0).toUpperCase() +
                                    attr.name.slice(1).toLowerCase()}
                            </AccordionTrigger>

                            <AccordionContent className="pl-2 pt-2 text-sm text-[var(--store-text)]">
                                <ul className="space-y-1">
                                    {attr.values.map((value) => (
                                        <li
                                            key={value}
                                            onClick={() =>
                                                toggleCheckboxValue(
                                                    attr.name,
                                                    value
                                                )
                                            }
                                            className="flex items-center gap-2 px-2 cursor-pointer py-1 select-none text-[var(--store-text)] hover:bg-[var(--store-surface-hover)]"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !!selectedFilters[
                                                        attr.name
                                                    ]?.includes(value)
                                                }
                                                readOnly
                                                className="pointer-events-none accent-[var(--store-primary)]"
                                            />

                                            {isColorAttribute && (
                                                <ColorCircle
                                                    color={value}
                                                    size={16}
                                                />
                                            )}

                                            <span className="text-sm text-[var(--store-text)]">
                                                {value}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </aside>
    );
}
