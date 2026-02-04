"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LuListFilter, LuX } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import ColorCircle from "@/components/ui/ColorCircle";
import { Checkbox } from "@/components/ui/checkbox"; // ✅ Checkbox de shadcn
import { Label } from "@/components/ui/label"; // ✅ Label de shadcn
import type { TFilter } from "@/src/schemas";

type Props = {
    filters: TFilter | null | undefined;
};

export default function DrawerFiltersMain({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

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

    // --- Price Range State ---
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

        // 1. CASO COLOR: SELECCIÓN ÚNICA (Radio)
        if (lowerKey === "color") {
            const currentColor = params.get(key);
            if (currentColor === value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        // 2. OTROS: SELECCIÓN MÚLTIPLE (Checkbox)
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
        setOpen(false);
    };

    const hasActiveFilters = Array.from(searchParams.keys()).some(
        (key) => !["page", "query", "sort", "limit"].includes(key)
    );

    // A) Item para Checkbox Estándar (Marcas, Categorías, etc.)
    const StandardFilterItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => {
        const id = `drawer-filter-${label.replace(/\s+/g, "-")}`;
        return (
            <li className="py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center space-x-4">
                    <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={onChange}
                        className="
                            w-5 h-5 rounded-md border-gray-300
                            data-[state=checked]:bg-[var(--store-primary)] 
                            data-[state=checked]:border-[var(--store-primary)]
                        "
                    />
                    <Label
                        htmlFor={id}
                        className={cn(
                            "text-base capitalize flex-1 cursor-pointer font-normal",
                            checked ? "font-semibold text-[var(--store-text)]" : "text-[var(--store-text-muted)]"
                        )}
                    >
                        {label}
                    </Label>
                </div>
            </li>
        );
    };

    // B) Item para Color (Radio Visual - Estilo Apple)
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
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-[var(--store-text)] bg-[var(--store-surface)] hover:bg-[var(--store-surface-hover)] active:scale-95 transition-all w-full">
                    <LuListFilter size={18} />
                    Filtros {hasActiveFilters}
                </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[92vh] bg-[var(--store-surface)] rounded-t-[24px]">
                {/* Header Fijo */}
                <DrawerHeader className="flex justify-between items-center px-6 py-5 border-b border-[var(--store-border)]">
                    <DrawerTitle className="text-lg font-bold uppercase tracking-widest text-[var(--store-text)] flex items-center gap-2">
                        Filtros
                    </DrawerTitle>

                    <div className="flex items-center gap-5">
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs font-bold text-[var(--store-primary)] uppercase tracking-wider flex items-center gap-1 active:opacity-60"
                            >
                                Limpiar <RiDeleteBinLine size={16} />
                            </button>
                        )}
                        <DrawerClose className="p-2 -mr-3 text-[var(--store-text-muted)] active:text-[var(--store-text)] bg-gray-100 rounded-full">
                            <LuX size={20} />
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Contenido Scrollable */}
                <ScrollArea className="h-full overflow-y-auto px-6 pb-24 pt-4">
                    <Accordion type="multiple" defaultValue={["categories", "price", "brands", "color"]} className="w-full space-y-4">

                        {/* Categorías */}
                        {sortedCategories.length > 0 && (
                            <AccordionItem value="categories" className="border-b-[var(--store-border)]">
                                <AccordionTrigger className="text-base font-bold text-[var(--store-text)] py-4 hover:no-underline">
                                    Categorías
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <ul className="flex flex-col">
                                        {sortedCategories.map((c) => (
                                            <StandardFilterItem
                                                key={c.slug}
                                                label={c.nombre}
                                                checked={searchParams.getAll("category").includes(c.slug)}
                                                onChange={() => handleFilterChange("category", c.slug)}
                                            />
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Precio */}
                        {priceFilter && (
                            <AccordionItem value="price" className="border-b-[var(--store-border)]">
                                <AccordionTrigger className="text-base font-bold text-[var(--store-text)] py-4 hover:no-underline">
                                    Rango de Precio
                                </AccordionTrigger>
                                <AccordionContent className="pt-6 pb-8 px-2">
                                    <Slider
                                        min={priceFilter.min ?? 0}
                                        max={priceFilter.max ?? 1000}
                                        step={10}
                                        value={priceRange}
                                        onValueChange={(val) => setPriceRange(val as [number, number])}
                                        onValueCommit={(val) => updatePriceRange(val as [number, number])}
                                        className="mb-8 cursor-pointer h-8" // Slider más alto para toque
                                    />
                                    <div className="flex justify-between items-center text-sm font-semibold text-[var(--store-text)]">
                                        <div className="bg-[var(--store-bg)] px-4 py-2 rounded-xl border border-[var(--store-border)] min-w-[80px] text-center">
                                            S/ {priceRange[0]}
                                        </div>
                                        <span className="text-[var(--store-text-muted)] font-light mx-2">-</span>
                                        <div className="bg-[var(--store-bg)] px-4 py-2 rounded-xl border border-[var(--store-border)] min-w-[80px] text-center">
                                            S/ {priceRange[1]}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Marcas */}
                        {sortedBrands.length > 0 && (
                            <AccordionItem value="brands" className="border-b-[var(--store-border)]">
                                <AccordionTrigger className="text-base font-bold text-[var(--store-text)] py-4 hover:no-underline">
                                    Marcas
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <ul className="flex flex-col">
                                        {sortedBrands.map((b) => (
                                            <StandardFilterItem
                                                key={b.slug}
                                                label={b.nombre}
                                                checked={searchParams.getAll("brand").includes(b.slug)}
                                                onChange={() => handleFilterChange("brand", b.slug)}
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
                                    <AccordionTrigger className="text-base font-bold text-[var(--store-text)] py-4 hover:no-underline capitalize">
                                        {attr.name}
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-2">
                                        {isColor ? (
                                            // Grid de Colores (Radio)
                                            <ul className="grid grid-cols-5 gap-4 py-2">
                                                {attr.values.map((val) => (
                                                    <ColorFilterItem
                                                        key={val}
                                                        label={val}
                                                        checked={searchParams.get(attr.name.toLowerCase()) === val}
                                                        onChange={() => handleFilterChange(attr.name.toLowerCase(), val)}
                                                    />
                                                ))}
                                            </ul>
                                        ) : (
                                            // Lista Normal (Checkbox)
                                            <ul className="flex flex-col">
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
                </ScrollArea>

                {/* Footer Fijo con Sombra */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-[var(--store-surface)] border-t border-[var(--store-border)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
                    <button
                        onClick={() => setOpen(false)}
                        className="w-full bg-[var(--store-text)] text-[var(--store-surface)] font-bold py-4 rounded-2xl active:scale-[0.98] transition-transform text-base tracking-wide"
                    >
                        Ver Resultados
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}