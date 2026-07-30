"use client";

import { useState, useEffect } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import * as SliderPrimitive from "@radix-ui/react-slider";

export default function PriceRangeFilter({ filters }: { filters: CatalogFilters }) {
    const { searchParams, setPriceRange, clearPriceRange } = useCatalogNav();
    
    const globalMin = filters.price[0]?.min ?? 0;
    const globalMax = filters.price[0]?.max ?? 9999;
    
    const urlMin = searchParams.get('priceMin');
    const urlMax = searchParams.get('priceMax');
    
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
        new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(n);

    if (globalMin === globalMax || (globalMin === 0 && globalMax === 9999)) return null;

    return (
        <AccordionItem value="item-price" className="border-b border-border py-1">
            <AccordionTrigger className="text-[13px] font-semibold tracking-wide text-primary hover:no-underline py-3 px-1 hover:text-neutral-600 transition-colors">
                Precio
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-3 px-2">
                <SliderPrimitive.Root
                    className="relative flex w-full touch-none select-none items-center"
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
                    <SliderPrimitive.Track className="relative h-[3px] w-full grow overflow-hidden rounded-full bg-muted">
                        <SliderPrimitive.Range className="absolute h-full bg-primary" />
                    </SliderPrimitive.Track>

                    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-primary bg-background shadow-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none cursor-grab active:cursor-grabbing hover:scale-110" />
                    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border border-primary bg-background shadow-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none cursor-grab active:cursor-grabbing hover:scale-110" />
                </SliderPrimitive.Root>

                <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-muted-foreground">Mínimo</span>
                        <span className="text-xs font-medium tabular-nums text-foreground">{fmt(localValues[0])}</span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-semibold text-muted-foreground">Máximo</span>
                        <span className="text-xs font-medium tabular-nums text-foreground">{fmt(localValues[1])}</span>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}