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

    const sortedFilters = useMemo(() => ({
        categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
        atributos: [...filters.atributos]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((attr) => ({
                ...attr,
                values: [...attr.values].sort((a, b) => a.localeCompare(b)),
            })),
    }), [filters]);

    const triggerClass =
        "text-[11px] font-medium uppercase tracking-[0.06em] text-[var(--color-text-tertiary)] hover:no-underline py-3 px-0 border-b border-[var(--color-border-subtle)] hover:text-[var(--color-text-secondary)]";

    const row =
        "flex items-center gap-2 px-2 py-[5px] rounded cursor-pointer transition-colors hover:bg-[var(--color-bg-secondary)]";

    const checkboxClass =
        "w-3.5 h-3.5 rounded-[3px] border-[var(--color-border-default)] " +
        "data-[state=checked]:bg-[var(--color-accent-warm)] " +
        "data-[state=checked]:border-[var(--color-accent-warm)] " +
        "transition-colors duration-150";

    return (
        <div className="w-full pb-20 select-none">
            <ActiveFiltersSidebar />

            <Accordion
                type="multiple"
                className="w-full mt-4 space-y-3"
                defaultValue={["item-categories", "item-brands"]}
            >
                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-none">
                        <AccordionTrigger className={triggerClass}>
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent className="pt-1.5 pb-0">
                            <ul className="space-y-0">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    "w-full text-left px-2 py-[5px] text-[13px] rounded transition-colors duration-150",
                                                    active
                                                        ? "text-[var(--color-accent-warm)] font-medium"
                                                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
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
                        <AccordionTrigger className={triggerClass}>
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent className="pt-1.5 pb-0">
                            <div className="space-y-0 max-h-[220px] overflow-y-auto pr-1">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => setBrand(brand.slug)}
                                            className={row}
                                        >
                                            <Checkbox
                                                checked={active}
                                                className={checkboxClass}
                                            />
                                            <span className={cn(
                                                "text-[13px] transition-colors duration-150",
                                                active
                                                    ? "text-[var(--color-text-primary)]"
                                                    : "text-[var(--color-text-secondary)]"
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
                        <AccordionTrigger className={triggerClass}>
                            Modelos
                        </AccordionTrigger>
                        <AccordionContent className="pt-1.5 pb-0">
                            <div className="space-y-0 max-h-[220px] overflow-y-auto pr-1">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <div
                                            key={line.id}
                                            onClick={() => setLine(line.slug)}
                                            className={row}
                                        >
                                            <Checkbox
                                                checked={active}
                                                className={checkboxClass}
                                            />
                                            <span className={cn(
                                                "text-[13px] transition-colors duration-150",
                                                active
                                                    ? "text-[var(--color-text-primary)]"
                                                    : "text-[var(--color-text-secondary)]"
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
                            <AccordionTrigger className={triggerClass}>
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-1.5 pb-0">
                                <div className="space-y-0 max-h-[220px] overflow-y-auto pr-1">
                                    {attr.values.map((val) => {
                                        const isChecked = searchParams.getAll(attr.name).includes(val);

                                        return (
                                            <div
                                                key={val}
                                                onClick={() => updateFilter(attr.name, val)}
                                                className={row}
                                            >
                                                <Checkbox
                                                    checked={isChecked}
                                                    className={checkboxClass}
                                                />
                                                <div className="flex items-center gap-2">
                                                    {isColorAttr && (
                                                        <ColorCircle color={val} size={12} />
                                                    )}
                                                    <span className={cn(
                                                        "text-[13px] capitalize transition-colors duration-150",
                                                        isChecked
                                                            ? "text-[var(--color-text-primary)]"
                                                            : "text-[var(--color-text-secondary)]"
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