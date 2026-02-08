"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar"; // <--- Importamos el nuevo componente

interface Props {
    filters: CatalogFilters;
}

export default function CatalogSidebar({ filters }: Props) {
    const {
        setCategory, setBrand, setLine, updateFilter,
        isCategoryActive, isBrandActive, isLineActive, searchParams
    } = useCatalogNav();

    return (
        <div className="w-full pb-20 select-none">

            {/* 1. ZONA DE FILTROS ACTIVOS (Top Sidebar) */}
            <ActiveFiltersSidebar />

            <div className="space-y-8">

                {/* =========================================================
                    CATEGORÍAS (Estilo de Navegación Limpia)
                   ========================================================= */}
                {filters.categories.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)]">
                            Categorías
                        </h3>
                        <ul className="space-y-1">
                            {filters.categories.map((cat) => {
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
                    </div>
                )}

                {/* =========================================================
                    MARCAS (Checkboxes Minimalistas)
                   ========================================================= */}
                {filters.brands.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)]">
                            Marcas
                        </h3>
                        <ul className="space-y-2.5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                            {filters.brands.map((brand) => {
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
                                                // Pasamos el evento click al div padre para mejor hitbox
                                                className="border-[var(--store-border)] data-[state=checked]:bg-[var(--store-text)] data-[state=checked]:border-[var(--store-text)] w-4 h-4 rounded-sm transition-all"
                                            />
                                            <label
                                                htmlFor={`brand-${brand.id}`}
                                                className={cn(
                                                    "text-sm cursor-pointer select-none transition-colors",
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
                    </div>
                )}

                {/* =========================================================
                    LÍNEAS (Solo si aplica)
                   ========================================================= */}
                {filters.lines.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                        <div className="h-px bg-[var(--store-border)] opacity-50" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)]">
                            Modelos / Líneas
                        </h3>
                        <ul className="space-y-2.5">
                            {filters.lines.map((line) => {
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
                    </div>
                )}

                {/* =========================================================
                    ATRIBUTOS DINÁMICOS (Acordeón Ultra Limpio)
                   ========================================================= */}
                {filters.atributos.length > 0 && (
                    <>
                        <div className="h-px bg-[var(--store-border)] opacity-50" />
                        <Accordion
                            type="multiple"
                            className="w-full"
                            defaultValue={filters.atributos.slice(0, 3).map((_, i) => `attr-${i}`)}
                        >
                            {filters.atributos.map((attr, idx) => (
                                <AccordionItem key={idx} value={`attr-${idx}`} className="border-b-0 mb-1">
                                    <AccordionTrigger className="text-xs font-bold uppercase tracking-widest text-[var(--store-text-muted)] py-3 hover:text-[var(--store-text)] hover:no-underline transition-colors">
                                        {attr.name}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2 pt-1 pb-2">
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
                                                        <label
                                                            htmlFor={`${attr.name}-${val}`}
                                                            className={cn(
                                                                "text-sm cursor-pointer select-none transition-colors capitalize",
                                                                isChecked ? "font-medium text-[var(--store-text)]" : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
                                                            )}
                                                        >
                                                            {val}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </>
                )}
            </div>
        </div>
    );
}