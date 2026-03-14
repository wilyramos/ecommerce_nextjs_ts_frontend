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

    const sortedFilters = useMemo(() => {
        return {
            categories: [...filters.categories].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            ),
            brands: [...filters.brands].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            ),
            lines: [...filters.lines].sort((a, b) =>
                a.nombre.localeCompare(b.nombre)
            ),
            atributos: [...filters.atributos]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((attr) => ({
                    ...attr,
                    values: [...attr.values].sort((a, b) => a.localeCompare(b)),
                })),
        };
    }, [filters]);

    return (
        <div className="w-full pb-20 select-none">
            <ActiveFiltersSidebar />

            <Accordion
                type="multiple"
                className="w-full"
                defaultValue={[
                    "item-categories",
                  
                ]}
            >
                {/* CATEGORÍAS */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className="border-b border-[var(--store-border)]/50">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)] hover:no-underline py-4">
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1 pb-2">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    "w-full text-left py-1.5 px-2 rounded-md text-sm transition-all duration-200 flex items-center justify-between group",
                                                    active
                                                        ? "bg-[var(--store-text)] text-[var(--store-surface)] font-medium"
                                                        : "text-[var(--store-text)] hover:bg-[var(--store-bg)]"
                                                )}
                                            >
                                                {cat.nombre}
                                                {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
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
                    <AccordionItem value="item-brands" className="border-b border-[var(--store-border)]/50">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)] hover:no-underline py-4">
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar pb-2">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <li key={brand.id}>
                                            <div
                                                onClick={() => setBrand(brand.slug)}
                                                className={cn(
                                                    "flex items-center space-x-3 cursor-pointer group py-0.5",
                                                    active ? "opacity-100" : "opacity-80 hover:opacity-100"
                                                )}
                                            >
                                                <Checkbox
                                                    id={`brand-${brand.id}`}
                                                    checked={active}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-sm transition-all"
                                                />
                                                <label
                                                    htmlFor={`brand-${brand.id}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer select-none transition-colors",
                                                        active
                                                            ? "font-semibold text-[var(--store-text)]"
                                                            : "font-normal text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
                                                    )}
                                                >
                                                    {brand.nombre}
                                                </label>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* LÍNEAS */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className="border-b border-[var(--store-border)]/50">
                        <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)] hover:no-underline py-4">
                            Modelos / Líneas
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-2.5 pb-2">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <li key={line.id}>
                                            <div
                                                onClick={() => setLine(line.slug)}
                                                className="flex items-center space-x-3 cursor-pointer group"
                                            >
                                                <Checkbox
                                                    id={`line-${line.id}`}
                                                    checked={active}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-sm"
                                                />
                                                <label
                                                    htmlFor={`line-${line.id}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer select-none transition-colors",
                                                        active
                                                            ? "font-semibold text-[var(--store-text)]"
                                                            : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
                                                    )}
                                                >
                                                    {line.nombre}
                                                </label>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* ATRIBUTOS DINÁMICOS */}
                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");

                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className="border-b border-[var(--store-border)]/50">
                            <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)] hover:no-underline py-4">
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pb-2">
                                    {attr.values.map((val) => {
                                        const isChecked = searchParams.getAll(attr.name).includes(val);

                                        return (
                                            <div
                                                key={val}
                                                className="flex items-center space-x-3 cursor-pointer group py-0.5"
                                                onClick={() => updateFilter(attr.name, val)}
                                            >
                                                <Checkbox
                                                    id={`${attr.name}-${val}`}
                                                    checked={isChecked}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-sm"
                                                />
                                                <div className="flex items-center gap-2">
                                                    {isColorAttr && <ColorCircle color={val} size={18} />}
                                                    <label
                                                        htmlFor={`${attr.name}-${val}`}
                                                        className={cn(
                                                            "text-sm cursor-pointer select-none transition-colors capitalize",
                                                            isChecked
                                                                ? "font-medium text-[var(--store-text)]"
                                                                : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
                                                        )}
                                                    >
                                                        {val}
                                                    </label>
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