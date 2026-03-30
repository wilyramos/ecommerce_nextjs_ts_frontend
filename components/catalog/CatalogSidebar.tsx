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

    // Ordenamiento alfabético consistente
    const sortedFilters = useMemo(() => {
        return {
            categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
            atributos: [...filters.atributos]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((attr) => ({
                    ...attr,
                    values: [...attr.values].sort((a, b) => a.localeCompare(b)),
                })),
        };
    }, [filters]);

    // Clases reutilizables para mantener consistencia
    const accordionItemClass = "border-b-0 mb-4"; 
    const accordionTriggerClass = "text-[13px] font-bold uppercase tracking-wider text-[var(--store-text)] hover:no-underline py-3 px-1 border-b border-[var(--store-border)]";
    const checkboxRowClass = "flex items-center space-x-3 cursor-pointer group p-2 -mx-2 rounded-md hover:bg-[var(--store-bg)] transition-colors";

    return (
        <div className="w-full pb-20 select-none">
            <ActiveFiltersSidebar />

            <Accordion
                type="multiple"
                className="w-full mt-4"
                defaultValue={["item-categories", "item-brands"]}
            >
                {/* ==========================================
                    CATEGORÍAS (Navegación Principal)
                    Diseño: Píldoras (Pills) sin checkbox
                ========================================== */}
                {sortedFilters.categories.length > 0 && (
                    <AccordionItem value="item-categories" className={accordionItemClass}>
                        <AccordionTrigger className={accordionTriggerClass}>
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent className="pt-3">
                            <ul className="space-y-1">
                                {sortedFilters.categories.map((cat) => {
                                    const active = isCategoryActive(cat.slug);
                                    return (
                                        <li key={cat.id}>
                                            <button
                                                onClick={() => setCategory(cat.slug)}
                                                className={cn(
                                                    "w-full text-left py-2 px-3 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group",
                                                    active
                                                        ? "bg-[var(--store-text)] text-[var(--store-surface)] font-medium shadow-sm"
                                                        : "text-[var(--store-text-muted)] hover:text-[var(--store-text)] hover:bg-[var(--store-bg)]"
                                                )}
                                            >
                                                {cat.nombre}
                                                {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--store-surface)]" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* ==========================================
                    MARCAS (Selección Múltiple)
                    Diseño: Lista con Checkboxes + Hover Row
                ========================================== */}
                {sortedFilters.brands.length > 0 && (
                    <AccordionItem value="item-brands" className={accordionItemClass}>
                        <AccordionTrigger className={accordionTriggerClass}>
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent className="pt-3">
                            <ul className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {sortedFilters.brands.map((brand) => {
                                    const active = isBrandActive(brand.slug);
                                    return (
                                        <li key={brand.id}>
                                            <div
                                                onClick={() => setBrand(brand.slug)}
                                                className={cn(checkboxRowClass, active ? "opacity-100" : "opacity-80 hover:opacity-100")}
                                            >
                                                <Checkbox
                                                    id={`brand-${brand.id}`}
                                                    checked={active}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-[4px] transition-all"
                                                />
                                                <label
                                                    htmlFor={`brand-${brand.id}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer select-none w-full",
                                                        active ? "font-semibold text-[var(--store-text)]" : "font-normal text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
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

                {/* ==========================================
                    LÍNEAS / MODELOS
                ========================================== */}
                {sortedFilters.lines.length > 0 && (
                    <AccordionItem value="item-lines" className={accordionItemClass}>
                        <AccordionTrigger className={accordionTriggerClass}>
                            Modelos / Líneas
                        </AccordionTrigger>
                        <AccordionContent className="pt-3">
                            <ul className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                {sortedFilters.lines.map((line) => {
                                    const active = isLineActive(line.slug);
                                    return (
                                        <li key={line.id}>
                                            <div
                                                onClick={() => setLine(line.slug)}
                                                className={checkboxRowClass}
                                            >
                                                <Checkbox
                                                    id={`line-${line.id}`}
                                                    checked={active}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-[4px]"
                                                />
                                                <label
                                                    htmlFor={`line-${line.id}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer select-none w-full",
                                                        active ? "font-semibold text-[var(--store-text)]" : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
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

                {/* ==========================================
                    ATRIBUTOS DINÁMICOS (Capacidad, Color, etc.)
                ========================================== */}
                {sortedFilters.atributos.map((attr, idx) => {
                    const isColorAttr = attr.name.toLowerCase().includes("color");

                    return (
                        <AccordionItem key={idx} value={`attr-${idx}`} className={accordionItemClass}>
                            <AccordionTrigger className={accordionTriggerClass}>
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-3">
                                <div className="space-y-0.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                                    {attr.values.map((val) => {
                                        const isChecked = searchParams.getAll(attr.name).includes(val);

                                        return (
                                            <div
                                                key={val}
                                                className={checkboxRowClass}
                                                onClick={() => updateFilter(attr.name, val)}
                                            >
                                                <Checkbox
                                                    id={`${attr.name}-${val}`}
                                                    checked={isChecked}
                                                    className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-[4px]"
                                                />
                                                <div className="flex items-center gap-2 w-full">
                                                    {isColorAttr && <ColorCircle color={val} size={16} />}
                                                    <label
                                                        htmlFor={`${attr.name}-${val}`}
                                                        className={cn(
                                                            "text-sm cursor-pointer select-none capitalize w-full",
                                                            isChecked ? "font-semibold text-[var(--store-text)]" : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
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