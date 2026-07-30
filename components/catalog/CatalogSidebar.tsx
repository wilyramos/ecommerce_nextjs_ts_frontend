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

    const triggerClass = "text-[13px] font-semibold tracking-wide text-primary hover:no-underline py-3 px-1 hover:text-neutral-600 transition-colors";
    
    const rowClass = "flex items-center gap-3 px-2 py-2 cursor-pointer transition-all duration-200 hover:bg-muted/50 rounded-md group text-muted-foreground hover:text-primary outline-none";
    
    const badgeClass = "text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground group-hover:bg-background-secondary transition-colors";

    const checkboxClass =
        "w-4 h-4 border-muted rounded-sm " +
        "data-[state=checked]:bg-primary " +
        "data-[state=checked]:border-primary " +
        "data-[state=checked]:text-primary-foreground " +
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 " +
        "transition-colors duration-150 cursor-pointer";

    return (
        <div className="w-full select-none text-foreground bg-background pb-8 lg:pb-4 lg:p-5">
            <ActiveFiltersSidebar />
            
            <Accordion
                type="multiple"
                className="w-full space-y-1"
                defaultValue={["item-categories", "item-price"]}
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
                            <ul className="space-y-0.5 pr-1">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    rowClass,
                                                    "w-full justify-between pl-2.5", 
                                                    active && "bg-muted/50 text-primary font-semibold"
                                                )}
                                            >
                                                <span className="text-xs">{cat.nombre}</span>
                                                {cat.count !== undefined && (
                                                    <span className={cn(badgeClass, active && "bg-background-secondary text-primary")}>
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
                            <div className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(rowClass, active && "bg-muted/50 text-primary")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className={cn("text-xs flex-1", active ? "font-semibold" : "font-medium")}>
                                                {brand.nombre}
                                            </span>
                                            {brand.count !== undefined && (
                                                <span className={cn(badgeClass, active && "bg-background-secondary text-primary")}>
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
                            <div className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(rowClass, active && "bg-muted/50 text-primary")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className={cn("text-xs flex-1", active ? "font-semibold" : "font-medium")}>
                                                {line.nombre}
                                            </span>
                                            {line.count !== undefined && (
                                                <span className={cn(badgeClass, active && "bg-background-secondary text-primary")}>
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
                            <AccordionTrigger className={cn(triggerClass, "capitalize")}>
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2">
                                <div className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                                    {attr.values.map((val) => {
                                        const strVal = typeof val === 'string' ? val : val.value;
                                        const count = typeof val === 'string' ? undefined : val.count;
                                        const isChecked = searchParams.getAll(attr.name).includes(strVal);
                                        
                                        return (
                                            <div
                                                key={strVal}
                                                onClick={() => updateFilter(attr.name, strVal)}
                                                className={cn(rowClass, isChecked && "bg-muted/50 text-primary")}
                                            >
                                                <Checkbox checked={isChecked} className={checkboxClass} />
                                                <div className="flex items-center gap-2 flex-1">
                                                    {isColorAttr && <ColorCircle color={strVal} size={12} />}
                                                    <span className={cn("text-xs capitalize", isChecked ? "font-semibold" : "font-medium")}>
                                                        {strVal}
                                                    </span>
                                                </div>
                                                {count !== undefined && (
                                                    <span className={cn(badgeClass, isChecked && "bg-background-secondary text-primary")}>
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