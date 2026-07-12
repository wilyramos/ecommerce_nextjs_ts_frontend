"use client";

import { useMemo } from "react";
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
import PriceRangeFilter from "./PriceRangeFilter";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";
import ColorCircle from "../ui/ColorCircle";

interface Props {
    filters: CatalogFilters;
}

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

    const sortedFilters = useMemo(() => {
        const priorityOrder: Record<string, number> = {
            "color": 1,
            "compatibilidad": 2,
            "modelo compatible": 3,
            "ram": 4,
        };

        return {
            categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            atributos: [...filters.atributos]
                .sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    const priorityA = priorityOrder[nameA] ?? 999;
                    const priorityB = priorityOrder[nameB] ?? 999;
                    if (priorityA !== priorityB) return priorityA - priorityB;
                    return nameA.localeCompare(nameB);
                })
                .map((attr) => ({
                    ...attr,
                    values: [...attr.values].sort((a, b) => {
                        const va = typeof a === 'string' ? a : a.value;
                        const vb = typeof b === 'string' ? b : b.value;
                        return va.localeCompare(vb);
                    }),
                })),
        };
    }, [filters]);

    const triggerClass =
        "text-xs font-bold capitalize tracking-wider text-primary hover:no-underline py-3 px-0 hover:text-neutral-600 transition-colors";

    const row =
        "flex items-center gap-3 px-2 py-2 cursor-pointer transition-all duration-150 hover:bg-neutral-50 rounded-sm group text-muted-foreground hover:text-primary";

    const checkboxClass =
        "w-4 h-4 border-muted rounded-none " +
        "data-[state=checked]:bg-primary " +
        "data-[state=checked]:border-primary " +
        "data-[state=checked]:text-primary-foreground " +
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 " +
        "transition-colors duration-150 cursor-pointer";

    return (
        <div className="w-full pb-6 select-none text-foreground bg-background md:border md:border-border/60 md:p-4 p-2">
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
                                                    "w-full text-left flex items-center justify-between px-2 py-2 text-xs transition-all duration-150 outline-none font-medium rounded-sm cursor-pointer",
                                                    active
                                                        ? "bg-neutral-100 text-primary font-bold"
                                                        : "text-muted-foreground hover:bg-neutral-50 hover:text-primary"
                                                )}
                                            >
                                                <span>{cat.nombre}</span>
                                                {cat.count !== undefined && (
                                                    <span className={cn(
                                                        "text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-sm bg-neutral-100 text-muted-foreground/80", 
                                                        active && "bg-neutral-200/80 text-primary"
                                                    )}>
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
                                            className={cn(
                                                row, 
                                                active && "bg-neutral-100 text-primary font-bold"
                                            )}
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
                                            className={cn(
                                                row, 
                                                active && "bg-neutral-100 text-primary font-bold"
                                            )}
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

                {/* ATRIBUTOS EN GENERAL */}
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
                                                className={cn(
                                                    row, 
                                                    isChecked && "bg-neutral-100 text-primary font-bold"
                                                )}
                                            >
                                                <Checkbox checked={isChecked} className={checkboxClass} />
                                                <div className="flex items-center gap-2 flex-1">
                                                    {isColorAttr && <ColorCircle color={strVal} size={12} />}
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