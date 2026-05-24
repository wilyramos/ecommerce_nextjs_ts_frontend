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
            .map(attr => ({
                ...attr,
                values: [...attr.values].sort((a, b) => a.localeCompare(b)),
            })),
    }), [filters]);

    const triggerClass =
        "text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground " +
        "hover:no-underline py-3 px-0 border-b border-border hover:text-foreground transition-colors";

    const row =
        "flex items-center gap-2.5 px-2 py-2 rounded-sm cursor-pointer " +
        "transition-colors hover:bg-background-secondary hover:text-foreground";

    const checkboxClass =
        "w-3.5 h-3.5 rounded-sm border-border " +
        "data-[state=checked]:bg-action-cta " +
        "data-[state=checked]:border-action-cta " +
        "data-[state=checked]:text-primary-foreground " +
        "focus-visible:ring-offset-0 focus-visible:ring-0 " +
        "transition-colors duration-150";

    return (
        <div className="w-full pb-20 select-none bg-background text-foreground">

            <ActiveFiltersCollection />


            <Accordion
                type="multiple"
                className="w-full mt-4 space-y-2"
                defaultValue={["item-categories", "item-brands"]}
            >
                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-none">
                        <AccordionTrigger className={triggerClass}>Categorías</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                            <ul className="space-y-0.5">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    "w-full text-left px-2 py-2 text-[13px] rounded-sm transition-colors duration-150 outline-none font-medium",
                                                    active
                                                        ? "bg-background-secondary text-action-cta font-bold"
                                                        : "text-muted-foreground hover:bg-background-secondary/60 hover:text-foreground"
                                                )}
                                            >
                                                {cat.nombre}
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
                    <AccordionItem value="item-brands" className="border-none">
                        <AccordionTrigger className={triggerClass}>Marcas</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                            <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={cn(row, active && "bg-background-secondary text-foreground font-semibold")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className={cn(
                                                "text-[13px] font-medium transition-colors duration-150",
                                                active ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {brand.nombre}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* LÍNEAS */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-none">
                        <AccordionTrigger className={triggerClass}>Modelos</AccordionTrigger>
                        <AccordionContent className="pt-2 pb-0">
                            <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={cn(row, active && "bg-background-secondary text-foreground font-semibold")}
                                        >
                                            <Checkbox checked={active} className={checkboxClass} />
                                            <span className={cn(
                                                "text-[13px] font-medium transition-colors duration-150",
                                                active ? "text-foreground" : "text-muted-foreground"
                                            )}>
                                                {line.nombre}
                                            </span>
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
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-none">
                            <AccordionTrigger className={triggerClass}>{attr.name}</AccordionTrigger>
                            <AccordionContent className="pt-2 pb-0">
                                <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                                    {attr.values.map((val) => {
                                        const checked = searchParams.getAll(attr.name).includes(val);
                                        return (
                                            <div
                                                key={val}
                                                onClick={() => updateFilter(attr.name, val)}
                                                className={cn(row, checked && "bg-background-secondary text-foreground font-semibold")}
                                            >
                                                <Checkbox checked={checked} className={checkboxClass} />
                                                <div className="flex items-center gap-2">
                                                    {isColorAttr && <ColorCircle color={val} size={12} />}
                                                    <span className={cn(
                                                        "text-[13px] font-medium capitalize transition-colors duration-150",
                                                        checked ? "text-foreground" : "text-muted-foreground"
                                                    )}>
                                                        {val}
                                                    </span>
                                                </div>
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