"use client";

import { useState, useEffect } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { H4, Price } from "@/components/ui/TypographyStore";
import * as SliderPrimitive from "@radix-ui/react-slider";

export default function PriceRangeFilter({ filters }: { filters: CatalogFilters }) {
    const { searchParams, setPriceRange, clearPriceRange } = useCatalogNav();

    const globalMin = filters.price[0]?.min ?? 0;
    const globalMax = filters.price[0]?.max ?? 9999;

    const urlMin = searchParams.get("priceMin");
    const urlMax = searchParams.get("priceMax");

    const [localValues, setLocalValues] = useState<[number, number]>([
        urlMin ? Number(urlMin) : globalMin,
        urlMax ? Number(urlMax) : globalMax,
    ]);

    useEffect(() => {
        setLocalValues([
            urlMin ? Number(urlMin) : globalMin,
            urlMax ? Number(urlMax) : globalMax,
        ]);
    }, [urlMin, urlMax, globalMin, globalMax]);

    const fmt = (n: number) =>
        new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(n);

    if (globalMin === globalMax || (globalMin === 0 && globalMax === 9999)) return null;

    return (
        <AccordionItem value="item-price" className="border-b border-border-primary/40 py-1">
            <AccordionTrigger className="py-3 text-[13px] font-semibold text-text-primary transition-opacity duration-fast hover:opacity-80 hover:no-underline outline-none">
                Precio
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-4 px-2">
                <SliderPrimitive.Root
                    className="relative flex w-full touch-none select-none items-center py-2"
                    min={globalMin}
                    max={globalMax}
                    step={1}
                    value={localValues}
                    onValueChange={(vals) => setLocalValues(vals as [number, number])}
                    onValueCommit={(vals) => {
                        const [min, max] = vals as [number, number];
                        if (min === globalMin && max === globalMax) {
                            clearPriceRange();
                        } else {
                            setPriceRange(min, max);
                        }
                    }}
                >
                    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-radius-full bg-surface-tertiary">
                        <SliderPrimitive.Range className="absolute h-full bg-brand-primary" />
                    </SliderPrimitive.Track>

                    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-radius-full border border-black/5 bg-surface-primary shadow-md ring-offset-surface-primary transition-transform duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 disabled:pointer-events-none cursor-grab active:cursor-grabbing active:scale-110" />
                    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-radius-full border border-black/5 bg-surface-primary shadow-md ring-offset-surface-primary transition-transform duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 disabled:pointer-events-none cursor-grab active:cursor-grabbing active:scale-110" />
                </SliderPrimitive.Root>

                <div className="flex justify-between mt-5">
                    <div className="flex flex-col gap-0.5">
                        <H4 className="text-[11px] font-medium text-text-secondary">Mínimo</H4>
                        <Price className="text-[13px] font-medium tabular-nums text-text-primary">{fmt(localValues[0])}</Price>
                    </div>
                    <div className="flex flex-col gap-0.5 text-right">
                        <H4 className="text-[11px] font-medium text-text-secondary">Máximo</H4>
                        <Price className="text-[13px] font-medium tabular-nums text-text-primary">{fmt(localValues[1])}</Price>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}