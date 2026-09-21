// File: frontend/components/catalog/PriceRangeFilter.tsx
"use client";

import { useState, useEffect } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { H4 } from "@/components/ui/TypographyV3";
import { InputV3 } from "@/components/ui/InputV3";
import * as SliderPrimitive from "@radix-ui/react-slider";

export default function PriceRangeFilter({
    filters,
}: {
    filters: CatalogFilters;
}) {
    const { searchParams, setPriceRange, clearPriceRange } = useCatalogNav();

    const globalMin = filters.price[0]?.min ?? 0;
    const globalMax = filters.price[0]?.max ?? 9999;

    const urlMin = searchParams.get("priceMin");
    const urlMax = searchParams.get("priceMax");

    const [sliderValues, setSliderValues] = useState<[number, number]>([
        urlMin ? Number(urlMin) : globalMin,
        urlMax ? Number(urlMax) : globalMax,
    ]);

    const [inputMin, setInputMin] = useState<string>(
        urlMin ? String(urlMin) : String(globalMin)
    );
    const [inputMax, setInputMax] = useState<string>(
        urlMax ? String(urlMax) : String(globalMax)
    );

    useEffect(() => {
        const min = urlMin ? Number(urlMin) : globalMin;
        const max = urlMax ? Number(urlMax) : globalMax;
        setSliderValues([min, max]);
        setInputMin(String(min));
        setInputMax(String(max));
    }, [urlMin, urlMax, globalMin, globalMax]);

    if (globalMin === globalMax || (globalMin === 0 && globalMax === 9999)) {
        return null;
    }

    const commitRange = (min: number, max: number) => {
        const clampedMin = Math.max(globalMin, Math.min(min, globalMax));
        const clampedMax = Math.min(globalMax, Math.max(max, globalMin));
        const finalMin = Math.min(clampedMin, clampedMax);
        const finalMax = Math.max(clampedMin, clampedMax);

        setSliderValues([finalMin, finalMax]);
        setInputMin(String(finalMin));
        setInputMax(String(finalMax));

        if (finalMin === globalMin && finalMax === globalMax) {
            clearPriceRange();
        } else {
            setPriceRange(finalMin, finalMax);
        }
    };

    const handleMinBlur = () => {
        const parsed = Number(inputMin);
        const nextMin = isNaN(parsed) ? globalMin : parsed;
        commitRange(nextMin, sliderValues[1]);
    };

    const handleMaxBlur = () => {
        const parsed = Number(inputMax);
        const nextMax = isNaN(parsed) ? globalMax : parsed;
        commitRange(sliderValues[0], nextMax);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        }
    };

    return (
        <AccordionItem
            value="item-price"
            className="border-b border-border-primary/50 py-0.5"
        >
            <AccordionTrigger className="group flex w-full items-center justify-between py-3.5 outline-none transition-opacity duration-fast hover:no-underline">
                <div className="flex items-center gap-2">
                    <H4 className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary transition-colors duration-fast group-hover:text-brand-primary">
                        Precio
                    </H4>
                 
                </div>
            </AccordionTrigger>

            <AccordionContent className="px-1.5 pt-1 pb-5">
                <div className="relative flex items-center px-1">
                    <SliderPrimitive.Root
                        className="relative flex w-full touch-none select-none items-center py-3"
                        min={globalMin}
                        max={globalMax}
                        step={1}
                        value={sliderValues}
                        onValueChange={(vals) => {
                            const [min, max] = vals as [number, number];
                            setSliderValues([min, max]);
                            setInputMin(String(min));
                            setInputMax(String(max));
                        }}
                        onValueCommit={(vals) => {
                            const [min, max] = vals as [number, number];
                            commitRange(min, max);
                        }}
                    >
                        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-brand-secondary-dark">
                            <SliderPrimitive.Range className="absolute h-full bg-brand-primary transition-all duration-fast" />
                        </SliderPrimitive.Track>

                        <SliderPrimitive.Thumb
                            aria-label="Precio mínimo"
                            className="block size-4 cursor-grab rounded-full border-2 border-surface-primary bg-brand-primary shadow-[0_2px_6px_rgba(23,23,23,0.35)] outline-none transition-transform duration-fast hover:scale-115 focus-visible:ring-2 focus-visible:ring-brand-primary/40 active:cursor-grabbing active:scale-95 disabled:pointer-events-none"
                        />
                        <SliderPrimitive.Thumb
                            aria-label="Precio máximo"
                            className="block size-4 cursor-grab rounded-full border-2 border-surface-primary bg-brand-primary shadow-[0_2px_6px_rgba(23,23,23,0.35)] outline-none transition-transform duration-fast hover:scale-115 focus-visible:ring-2 focus-visible:ring-brand-primary/40 active:cursor-grabbing active:scale-95 disabled:pointer-events-none"
                        />
                    </SliderPrimitive.Root>
                </div>

                <div className="mt-4 grid grid-cols-2 items-center gap-2">
                    <div className="relative">
                        <InputV3
                            label="Desde (S/)"
                            type="number"
                            min={globalMin}
                            max={globalMax}
                            value={inputMin}
                            onChange={(e) => setInputMin(e.target.value)}
                            onBlur={handleMinBlur}
                            onKeyDown={handleKeyDown}
                            className="h-9 text-[8px] font-semibold tabular-nums text-brand-primary-light hover:border-brand-primary/50 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                    </div>

                    <div className="relative">
                        <InputV3
                            label="Hasta (S/)"
                            type="number"
                            min={globalMin}
                            max={globalMax}
                            value={inputMax}
                            onChange={(e) => setInputMax(e.target.value)}
                            onBlur={handleMaxBlur}
                            onKeyDown={handleKeyDown}
                            className="h-9 text-[8px] font-semibold tabular-nums text-brand-primary-light hover:border-brand-primary/50 focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}