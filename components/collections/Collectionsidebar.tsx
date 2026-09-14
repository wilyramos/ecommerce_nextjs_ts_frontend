// File: frontend/components/collections/CollectionSidebar.tsx
"use client";

import { useMemo } from "react";
import { useCollectionNav } from "./hooks/useCollectionNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import ColorCircle from "@/components/ui/ColorCircle";
import ActiveFiltersCollection from "./ActiveFiltersCollection";

interface Props {
    filters: CatalogFilters;
}

export default function CollectionSidebar({ filters }: Props) {
    const {
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        searchParams,
    } = useCollectionNav();

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
        "text-xs font-semibold uppercase tracking-widest text-text-primary hover:no-underline py-4 px-1 border-b border-border-primary/40 transition-colors";

    const row =
        "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 ease-out hover:bg-surface-secondary";

    const checkboxClass =
        "w-4 h-4 rounded-[4px] border-border-strong/50 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary text-white focus-visible:ring-offset-0 focus-visible:ring-0 transition-all duration-300 shadow-sm";

    return (
        <div className="w-full pb-20 select-none bg-surface-primary text-text-primary pr-2">
            <ActiveFiltersCollection />

            <Accordion
                type="multiple"
                className="w-full mt-4 space-y-1"
                defaultValue={["item-categories", "item-brands"]}
            >
                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-none">
                        <AccordionTrigger className={triggerClass}>Categorías</AccordionTrigger>
                        <AccordionContent className="pt-3 pb-2">
                            <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-primary/50 scrollbar-track-transparent">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <div
                                            key={cat.id}
                                            onClick={() => setCategory(cat.slug)}
                                            className={cn(row, active && "bg-surface-secondary")}
                                        >
                                            <span
                                                className={cn(
                                                    "text-[13px] transition-colors flex-1",
                                                    active ? "font-semibold text-text-primary" : "font-medium text-text-secondary"
                                                )}
                                            >
                                                {cat.nombre}
                                            </span>
                                            {cat.count !== undefined && (
                                                <span className="text-[11px] tabular-nums text-text-tertiary">
                                                    {cat.count}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* MARCAS */}
                {sortedFilters.brands.length > 0 && (
                    <AccordionItem value="item-brands" className="border-none">
                        <AccordionTrigger className={triggerClass}>Marcas</AccordionTrigger>
                        <AccordionContent className="pt-3 pb-2">
                            <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-primary/50 scrollbar-track-transparent">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(row, active && "bg-surface-secondary")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span
                                                className={cn(
                                                    "text-[13px] transition-colors flex-1",
                                                    active ? "font-semibold text-text-primary" : "font-medium text-text-secondary"
                                                )}
                                            >
                                                {brand.nombre}
                                            </span>
                                            {brand.count !== undefined && (
                                                <span className="text-[11px] tabular-nums text-text-tertiary">
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

                {/* MODELOS (LÍNEAS) */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-none">
                        <AccordionTrigger className={triggerClass}>Modelos</AccordionTrigger>
                        <AccordionContent className="pt-3 pb-2">
                            <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-primary/50 scrollbar-track-transparent">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(row, active && "bg-surface-secondary")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span
                                                className={cn(
                                                    "text-[13px] transition-colors flex-1",
                                                    active ? "font-semibold text-text-primary" : "font-medium text-text-secondary"
                                                )}
                                            >
                                                {line.nombre}
                                            </span>
                                            {line.count !== undefined && (
                                                <span className="text-[11px] tabular-nums text-text-tertiary">
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

                {/* ATRIBUTOS (Ej. Colores) */}
                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");
                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-none">
                            <AccordionTrigger className={triggerClass}>{attr.name}</AccordionTrigger>
                            <AccordionContent className="pt-3 pb-2">
                                <div className="space-y-1 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border-primary/50 scrollbar-track-transparent">
                                    {attr.values.map((val) => {
                                        const strVal = typeof val === 'string' ? val : val.value;
                                        const count = typeof val === 'string' ? undefined : val.count;
                                        const isChecked = searchParams.getAll(attr.name).includes(strVal);

                                        return (
                                            <div
                                                key={strVal}
                                                onClick={() => updateFilter(attr.name, strVal)}
                                                className={cn(row, isChecked && "bg-surface-secondary")}
                                            >
                                                <Checkbox checked={isChecked} className={checkboxClass} />
                                                <div className="flex items-center gap-2 flex-1">
                                                    {isColorAttr && <ColorCircle color={strVal} size={14} />}
                                                    <span
                                                        className={cn(
                                                            "text-[13px] capitalize transition-colors",
                                                            isChecked ? "font-semibold text-text-primary" : "font-medium text-text-secondary"
                                                        )}
                                                    >
                                                        {strVal}
                                                    </span>
                                                </div>
                                                {count !== undefined && (
                                                    <span className="text-[11px] tabular-nums text-text-tertiary">
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