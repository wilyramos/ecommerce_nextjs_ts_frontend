"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TFilter } from "@/src/schemas";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { RiDeleteBinLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ColorCircle from "@/components/ui/ColorCircle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type ProductsFiltersProps = {
    filters: TFilter | null | undefined;
};

export default function ProductsFiltersMain({ filters }: ProductsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { brands = [], categories = [], atributos = [], price = [] } = filters ?? {};
    const priceFilter = price?.[0] ?? null;

    // --- Ordenamiento ---
    const sortedCategories = categories
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" }));

    const sortedBrands = brands
        .slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" }));

    const sortedAtributos = atributos
        .slice()
        .map((attr) => ({
            ...attr,
            values: attr.values
                .slice()
                .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    // --- Price State ---
    const [priceRange, setPriceRange] = useState<[number, number]>([
        priceFilter?.min ?? 0,
        priceFilter?.max ?? 1000,
    ]);

    useEffect(() => {
        const paramRange = searchParams.get("priceRange");
        if (paramRange) {
            const [min, max] = paramRange.split("-").map(Number);
            setPriceRange([min || 0, max || 1000]);
        } else if (priceFilter) {
            setPriceRange([priceFilter.min ?? 0, priceFilter.max ?? 1000]);
        }
    }, [searchParams, priceFilter]);

    if (!filters) return null;

    // --- HANDLERS ---

    const updateURL = (params: URLSearchParams) => {
        params.set("page", "1");
        router.push(`/productos?${params.toString()}`, { scroll: false });
    };

    const updatePriceRange = (range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceRange", `${range[0]}-${range[1]}`);
        updateURL(params);
    };

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const lowerKey = key.toLowerCase();

        // 1. CASO COLOR: SELECCIÓN ÚNICA (Radio Logic)
        if (lowerKey === "color") {
            const currentColor = params.get(key);
            if (currentColor === value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        // 2. CASO RESTO: SELECCIÓN MÚLTIPLE (Checkbox Logic)
        else {
            const currentValues = params.getAll(key);
            if (currentValues.includes(value)) {
                params.delete(key);
                currentValues.filter(v => v !== value).forEach(v => params.append(key, v));
            } else {
                params.append(key, value);
            }
        }
        updateURL(params);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        const query = searchParams.get("query");
        if (query) params.set("query", query);
        router.push(`/productos?${params.toString()}`);
    };

    const hasActiveFilters = Array.from(searchParams.keys()).some(
        (key) => !["page", "query", "sort", "limit"].includes(key)
    );

    // --- SUB-COMPONENTES ---

    // A) Item para Checkbox Estándar (Marcas, Categorías, etc.)
    const StandardFilterItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => {
        const id = `filter-${label.replace(/\s+/g, "-")}`;
        return (
            <li className="py-1.5">
                <div className="flex items-center space-x-3">
                    <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={onChange}
                        className="
                            data-[state=checked]:bg-[var(--store-primary)] 
                            data-[state=checked]:border-[var(--store-primary)]
                            border-gray-300 w-4 h-4 rounded-sm
                        "
                    />
                    <Label
                        htmlFor={id}
                        className={cn(
                            "text-sm capitalize cursor-pointer font-normal hover:text-[var(--store-text)] transition-colors",
                            checked ? "font-medium text-[var(--store-text)]" : "text-[var(--store-text-muted)]"
                        )}
                    >
                        {label}
                    </Label>
                </div>
            </li>
        );
    };

    const ColorFilterItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => {
        return (
            <li className="flex justify-center">
                <button
                    onClick={onChange}
                    className="group flex flex-col items-center justify-center gap-1.5 outline-none"
                    title={label}
                >
                    {/* Contenedor del Círculo (Aquí aplicamos el anillo de selección) */}
                    <div className={cn(
                        "rounded-full transition-all duration-200 p-0.5", // p-0.5 evita que el ring corte el círculo
                        checked
                            ? "ring-1 ring-offset-1 ring-[var(--store-primary)] scale-110"
                            : "group-hover:scale-110"
                    )}>
                        <ColorCircle color={label} size={24} />
                    </div>

                    {/* Nombre del Color */}
                    <span className={cn(
                        "text-[10px] capitalize leading-tight text-center max-w-[60px] truncate px-1",
                        checked
                            ? "font-semibold text-[var(--store-text)]"
                            : "text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]"
                    )}>
                        {label}
                    </span>
                </button>
            </li>
        );
    };

    return (
        <aside className="w-full space-y-1 select-none animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--store-text)] flex items-center gap-2">
                    Filtros
                </h2>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-[10px] font-medium text-[var(--store-primary)] hover:underline flex items-center gap-1 transition-all"
                    >
                        Limpiar <RiDeleteBinLine size={12} />
                    </button>
                )}
            </div>

            <Accordion type="multiple" defaultValue={["categories"]} className="w-full">

                {/* Categorías */}
                {sortedCategories.length > 0 && (
                    <AccordionItem value="categories" className="border-b-[var(--store-border)]">
                        <AccordionTrigger className="text-[13px] font-semibold text-[var(--store-text)] hover:no-underline py-4">
                            Categorías
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                            <ul className="space-y-1 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {sortedCategories.map((cat) => (
                                    <StandardFilterItem
                                        key={cat.id}
                                        label={cat.nombre}
                                        checked={searchParams.getAll("category").includes(cat.slug)}
                                        onChange={() => handleFilterChange("category", cat.slug)}
                                    />
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Precio */}
                {priceFilter && (
                    <AccordionItem value="price" className="border-b-[var(--store-border)]">
                        <AccordionTrigger className="text-[13px] font-semibold text-[var(--store-text)] hover:no-underline py-4">
                            Precio
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-6 px-1">
                            <Slider
                                min={priceFilter.min ?? 0}
                                max={priceFilter.max ?? 1000}
                                step={10}
                                value={priceRange}
                                onValueChange={(val) => setPriceRange(val as [number, number])}
                                onValueCommit={(val) => updatePriceRange(val as [number, number])}
                                className="my-6 cursor-pointer"
                            />
                            <div className="flex justify-between items-center text-xs font-medium text-[var(--store-text)]">
                                <span className="bg-[var(--store-bg)] px-2 py-1 rounded">S/ {priceRange[0]}</span>
                                <span className="text-[var(--store-text-muted)]">-</span>
                                <span className="bg-[var(--store-bg)] px-2 py-1 rounded">S/ {priceRange[1]}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Marcas */}
                {sortedBrands.length > 0 && (
                    <AccordionItem value="brands" className="border-b-[var(--store-border)]">
                        <AccordionTrigger className="text-[13px] font-semibold text-[var(--store-text)] hover:no-underline py-4">
                            Marcas
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                            <ul className="space-y-1 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                {sortedBrands.map((brand) => (
                                    <StandardFilterItem
                                        key={brand.id}
                                        label={brand.nombre}
                                        checked={searchParams.getAll("brand").includes(brand.slug)}
                                        onChange={() => handleFilterChange("brand", brand.slug)}
                                    />
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Atributos Dinámicos */}
                {sortedAtributos.map((attr) => {
                    const isColor = attr.name.toLowerCase() === "color";

                    return (
                        <AccordionItem key={attr.name} value={attr.name.toLowerCase()} className="border-b-[var(--store-border)]">
                            <AccordionTrigger className="text-[13px] font-semibold text-[var(--store-text)] hover:no-underline py-4 capitalize">
                                {attr.name}
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4">
                                {isColor ? (
                                    // GRID ESPECIAL PARA COLORES (Estilo Radio)
                                    <ul className="grid grid-cols-5 gap-3">
                                        {attr.values.map((val) => (
                                            <ColorFilterItem
                                                key={val}
                                                label={val}
                                                // Checked visual: Exact match (Single Select)
                                                checked={searchParams.get(attr.name.toLowerCase()) === val}
                                                onChange={() => handleFilterChange(attr.name.toLowerCase(), val)}
                                            />

                                        ))}
                                    </ul>
                                ) : (
                                    // LISTA ESTÁNDAR PARA OTROS ATRIBUTOS (Estilo Checkbox)
                                    <ul className="space-y-1 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                                        {attr.values.map((val) => (
                                            <StandardFilterItem
                                                key={val}
                                                label={val}
                                                checked={searchParams.getAll(attr.name.toLowerCase()).includes(val)}
                                                onChange={() => handleFilterChange(attr.name.toLowerCase(), val)}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}

            </Accordion>
        </aside>
    );
}