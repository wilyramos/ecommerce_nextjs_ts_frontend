"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { LuListFilter, LuX } from "react-icons/lu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import ColorCircle from "@/components/ui/ColorCircle";
import type { TFilter } from "@/src/schemas";


type Props = {
    filters: TFilter[] | null;
};

export default function DrawerFiltersMain({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    const { brands = [], atributos = [], price = [] } = filters?.[0] ?? {};
    const priceFilter = price?.[0] ?? null;

    // --- Ordenamiento seguro (Igual al Desktop) ---
    const sortedCategories = filters?.[0]?.categories
        ?.slice()
        .sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" })) ?? [];

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

    // --- Price range state ---
    const [priceRange, setPriceRange] = useState<[number, number]>([
        priceFilter?.min ?? 0,
        priceFilter?.max ?? 0,
    ]);

    useEffect(() => {
        if (!priceFilter) return;
        const paramRange = searchParams.get("priceRange");
        if (paramRange) {
            const [min, max] = paramRange.split("-").map(Number);
            setPriceRange([min || priceFilter.min || 0, max || priceFilter.max || 0]);
        } else {
            setPriceRange([priceFilter.min ?? 0, priceFilter.max ?? 0]);
        }
    }, [searchParams, priceFilter]);

    if (!filters?.length) return null;

    // --- Handlers ---
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.getAll(key).includes(value)) {
            const newValues = params.getAll(key).filter((v) => v !== value);
            params.delete(key);
            newValues.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }
        params.set("page", "1");
        router.push(`/productos?${params.toString()}`, { scroll: false });
    };

    const updatePriceRange = (range: [number, number]) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("priceRange", `${range[0]}-${range[1]}`);
        params.set("page", "1");
        router.push(`/productos?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        const query = searchParams.get("query");
        if (query) params.set("query", query);
        router.push(`/productos?${params.toString()}`);
        setOpen(false);
    };

    const hasActiveFilters = Array.from(searchParams.keys()).some(
        (key) => key !== "page" && key !== "query" && key !== "sort"
    );

    // --- Reutilización de diseño de Item (Desktop Mirror) ---
    const FilterCheckboxItem = ({
        label,
        checked,
        onChange,
        isColor = false
    }: { label: string, checked: boolean, onChange: () => void, isColor?: boolean }) => (
        <li className="group list-none">
            <label className={cn(
                "flex items-center gap-3 cursor-pointer py-2 px-1 transition-all duration-200",
                "active:bg-gray-100 rounded-md",
                checked ? "text-gray-900" : "text-gray-600"
            )}>
                <input
                    type="checkbox"
                    className={cn(
                        "appearance-none",
                        "w-5 h-5 rounded border border-gray-300 bg-white",
                        "transition-all duration-200 cursor-pointer relative",
                        "checked:bg-gray-900 checked:border-gray-900",
                        "after:content-[''] after:absolute after:opacity-0 checked:after:opacity-100",
                        "after:left-[6px] after:top-[2px] after:w-[6px] after:h-[10px]",
                        "after:border-white after:border-b-2 after:border-r-2 after:rotate-45"
                    )}
                    checked={checked}
                    onChange={onChange}
                />
                {isColor && <ColorCircle color={label} size={18} />}
                <span className={cn(
                    "text-[15px] select-none capitalize leading-none pt-0.5",
                    checked ? "font-semibold" : "font-normal"
                )}>
                    {label}
                </span>
            </label>
        </li>
    );

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="w-full lg:hidden px-4 py-2.5 flex items-center gap-2 justify-center text-[var(--store-text)]">
                    <LuListFilter size={18} />
                    <span className="text-sm font-medium uppercase tracking-wider">Filtros</span>
                </button>
            </DrawerTrigger>

            <DrawerContent className="p-0 max-h-[90vh] bg-[var(--store-surface)]">
                <DrawerHeader className="p-4 border-b border-[var(--store-border)]">
                    <div className="flex w-full justify-between items-center">
                        <DrawerTitle className="text-lg font-light uppercase flex items-center gap-2">
                            <LuListFilter className="w-4 h-4" />
                            Filtros
                        </DrawerTitle>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs flex items-center gap-1.5 text-[var(--store-text-muted)] hover:text-[var(--store-text)] transition-colors underline underline-offset-2"
                            >
                                Limpiar <LuX className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </DrawerHeader>

                <ScrollArea className="h-full overflow-y-auto px-4 pb-10">
                    <Accordion type="multiple" defaultValue={[]} className="w-full space-y-1">

                        {/* Categorías */}
                        {sortedCategories.length > 0 && (
                            <AccordionItem value="categories" className="border-b">
                                <AccordionTrigger className="text-sm py-4 hover:no-underline capitalize">Categorías</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-1">
                                        {sortedCategories.map((c) => (
                                            <FilterCheckboxItem
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
                            <AccordionItem value="price" className="border-b">
                                <AccordionTrigger className="text-sm py-4 hover:no-underline">Precio</AccordionTrigger>
                                <AccordionContent className="pt-6 pb-4 px-2">
                                    <Slider
                                        min={priceFilter.min ?? 0}
                                        max={priceFilter.max ?? 1000}
                                        step={5}
                                        value={priceRange}
                                        onValueChange={(val) => setPriceRange(val as [number, number])}
                                        onValueCommit={(val) => updatePriceRange(val as [number, number])}
                                        className="[&_.relative]:bg-[var(--store-border)] [&_.absolute]:bg-[var(--store-primary)] [&_span]:border-[var(--store-primary)]"
                                    />
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="border border-[var(--store-border)] rounded-md px-4 py-2 bg-[var(--store-surface)] text-sm shadow-sm font-medium">
                                            S/. {priceRange[0]}
                                        </div>
                                        <div className="h-px w-6 bg-[var(--store-border)]"></div>
                                        <div className="border border-[var(--store-border)] rounded-md px-4 py-2 bg-[var(--store-surface)] text-sm shadow-sm font-medium">
                                            S/. {priceRange[1]}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        {/* Marcas */}
                        {sortedBrands.length > 0 && (
                            <AccordionItem value="brands" className="border-b">
                                <AccordionTrigger className="text-sm py-4 hover:no-underline">Marcas</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-1">
                                        {sortedBrands.map((b) => (
                                            <FilterCheckboxItem
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

                        {/* Atributos */}
                        {sortedAtributos.map((attr) => {
                            const isColor = attr.name.toLowerCase() === "color";
                            return (
                                <AccordionItem key={attr.name} value={attr.name} className="border-b">
                                    <AccordionTrigger className="text-sm py-4 hover:no-underline capitalize">{attr.name}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-1">
                                            {attr.values.map((v) => (
                                                <FilterCheckboxItem
                                                    key={v}
                                                    label={v}
                                                    checked={searchParams.getAll(attr.name).includes(v)}
                                                    onChange={() => handleFilterChange(attr.name, v)}
                                                    isColor={isColor}
                                                />
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}