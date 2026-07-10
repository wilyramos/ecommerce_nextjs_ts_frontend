// File: frontend/components/catalog/CatalogSidebar.tsx
"use client";

import { useMemo, useState } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import * as SliderPrimitive from "@radix-ui/react-slider";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";
import ColorCircle from "../ui/ColorCircle";

interface Props {
    filters: CatalogFilters;
}

// ─── Price Range Slider ────────────────────────────────────────────────────────
function PriceRangeFilter({ filters }: { filters: CatalogFilters }) {
    const { searchParams, setPriceRange, clearPriceRange } = useCatalogNav();

    const globalMin = filters.price[0]?.min ?? 0;
    const globalMax = filters.price[0]?.max ?? 9999;

    const urlMin = searchParams.get('priceMin');
    const urlMax = searchParams.get('priceMax');

    const [localValues, setLocalValues] = useState<[number, number]>([
        urlMin ? Number(urlMin) : globalMin,
        urlMax ? Number(urlMax) : globalMax,
    ]);

    const hasCustomRange = !!urlMin || !!urlMax;

    const fmt = (n: number) =>
        new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(n);

    if (globalMin === globalMax || (globalMin === 0 && globalMax === 9999)) return null;

    return (
        <AccordionItem value="item-price" className="border-b border-border py-1">
            <AccordionTrigger className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:no-underline py-3 px-0 hover:text-action-cta transition-colors">
                Precio
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-3 px-1">
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
                    <SliderPrimitive.Track className="relative h-[2px] w-full grow overflow-hidden rounded-full bg-muted">
                        <SliderPrimitive.Range className="absolute h-full bg-action-cta" />
                    </SliderPrimitive.Track>
                    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary bg-background ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-action-cta disabled:pointer-events-none cursor-grab active:cursor-grabbing hover:scale-110" />
                    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary bg-background ring-offset-background transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-action-cta disabled:pointer-events-none cursor-grab active:cursor-grabbing hover:scale-110" />
                </SliderPrimitive.Root>

                <div className="flex justify-between mt-3">
                    <span className="text-xs font-semibold tabular-nums text-primary">{fmt(localValues[0])}</span>
                    <span className="text-xs font-semibold tabular-nums text-primary">{fmt(localValues[1])}</span>
                </div>

                {hasCustomRange && (
                    <button
                        onClick={clearPriceRange}
                        className="mt-3 text-[11px] font-bold uppercase tracking-wider text-action-cta hover:text-action-cta-hover transition-colors block w-full text-center py-1.5 border border-dashed border-action-cta/30 hover:border-action-cta-hover bg-action-cta/5"
                    >
                        Restablecer precio
                    </button>
                )}
            </AccordionContent>
        </AccordionItem>
    );
}

// ─── Sidebar principal ─────────────────────────────────────────────────────────
export default function CatalogSidebar({ filters }: Props) {
    const {
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        searchParams,
    } = useCatalogNav();

    const sortedFilters = useMemo(() => ({
        categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        atributos: [...filters.atributos]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((attr) => ({
                ...attr,
                values: [...attr.values].sort((a, b) => {
                    const va = typeof a === 'string' ? a : a.value;
                    const vb = typeof b === 'string' ? b : b.value;
                    return va.localeCompare(vb);
                }),
            })),
    }), [filters]);

    const triggerClass =
        "text-[11px] font-bold uppercase tracking-[0.12em] text-primary hover:no-underline py-3 px-0 hover:text-action-cta transition-colors";

    const row =
        "flex items-center gap-2.5 px-2 py-1.5 cursor-pointer transition-all duration-150 hover:bg-neutral-50 rounded-sm group text-muted-foreground hover:text-primary";

    const checkboxClass =
        "w-4 h-4 border-muted rounded-none " +
        "data-[state=checked]:bg-primary " +
        "data-[state=checked]:border-primary " +
        "data-[state=checked]:text-primary-foreground " +
        "focus-visible:ring-0 focus-visible:ring-offset-0 " +
        "transition-colors duration-150 cursor-pointer";

    return (
        <div className="w-full pb-6 select-none text-foreground bg-background border border-border/60 p-4">
            <ActiveFiltersSidebar />

            <Accordion
                type="multiple"
                className="w-full space-y-1"
                defaultValue={["item-categories", "item-brands", "item-price"]}
            >
                {/* PRECIO */}
                <PriceRangeFilter filters={filters} />

                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-b border-border py-1">
                        <AccordionTrigger className={triggerClass}>
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2">
                            <ul className="space-y-0.5">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    "w-full text-left flex items-center justify-between px-2 py-1.5 text-xs transition-all duration-150 outline-none font-medium border-l-2 border-transparent cursor-pointer",
                                                    active
                                                        ? "bg-neutral-50 text-action-cta font-bold border-action-cta pl-2.5"
                                                        : "text-muted-foreground hover:bg-neutral-50 hover:text-primary"
                                                )}
                                            >
                                                <span>{cat.nombre}</span>
                                                {cat.count !== undefined && (
                                                    <span className={cn("text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm bg-neutral-100 text-muted-foreground/80", active && "bg-action-cta/10 text-action-cta")}>
                                                        {cat.count}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* MARCAS */}
                {sortedFilters.brands.length > 0 && (
                    <AccordionItem value="item-brands" className="border-b border-border py-1">
                        <AccordionTrigger className={triggerClass}>
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2">
                            <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(row, active && "bg-neutral-50 text-primary font-bold border-l-2 border-primary rounded-l-none pl-2.5")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className="text-xs font-medium flex-1">
                                                {brand.nombre}
                                            </span>
                                            {brand.count !== undefined && (
                                                <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm bg-neutral-100 text-muted-foreground/80">
                                                    {brand.count}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* LÍNEAS */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-b border-border py-1">
                        <AccordionTrigger className={triggerClass}>
                            Modelos
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2">
                            <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(row, active && "bg-neutral-50 text-primary font-bold border-l-2 border-primary rounded-l-none pl-2.5")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className="text-xs font-medium flex-1">
                                                {line.nombre}
                                            </span>
                                            {line.count !== undefined && (
                                                <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm bg-neutral-100 text-muted-foreground/80">
                                                    {line.count}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* ATRIBUTOS */}
                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");

                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-b border-border py-1">
                            <AccordionTrigger className={triggerClass}>
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2">
                                <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                    {attr.values.map((val) => {
                                        const strVal = typeof val === 'string' ? val : val.value;
                                        const count = typeof val === 'string' ? undefined : val.count;
                                        const isChecked = searchParams.getAll(attr.name).includes(strVal);

                                        return (
                                            <div
                                                key={strVal}
                                                onClick={() => updateFilter(attr.name, strVal)}
                                                className={cn(row, isChecked && "bg-neutral-50 text-primary font-bold border-l-2 border-primary rounded-l-none pl-2.5")}
                                            >
                                                <Checkbox checked={isChecked} className={checkboxClass} />
                                                <div className="flex items-center gap-2 flex-1">
                                                    {isColorAttr && <ColorCircle color={strVal} size={11}  />}
                                                    <span className="text-xs font-medium capitalize">
                                                        {strVal}
                                                    </span>
                                                </div>
                                                {count !== undefined && (
                                                    <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm bg-neutral-100 text-muted-foreground/80">
                                                        {count}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}