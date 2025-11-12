"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MdClear } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

import type { TFilter } from "@/src/schemas";

type Props = {
    filters: TFilter[] | null;
};

export default function DrawerFiltersMain({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    // inicializa datos aunque filters sea null
    const { brands = [], atributos = [], price = [] } = filters?.[0] ?? {};
    const priceFilter = price?.[0] ?? null;

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [minPrice, setMinPrice] = useState<number>(priceFilter?.min ?? 0);
    const [maxPrice, setMaxPrice] = useState<number>(priceFilter?.max ?? 0);

    useEffect(() => {
        if (!filters) return;

        const parsed: Record<string, string[]> = {};
        // load attributes filters
        atributos.forEach((attr) => {
            const vals = searchParams.getAll(attr.name);
            if (vals.length > 0) parsed[attr.name] = vals;
        });
        // load brands
        const brandsVals = searchParams.getAll("brand");
        if (brandsVals.length > 0) parsed["brand"] = brandsVals;

        setSelectedFilters(parsed);

        // load price
        if (priceFilter) {
            const range = searchParams.get("priceRange");
            const [min, max] = range?.split("-").map(Number) || [
                priceFilter.min ?? 0,
                priceFilter.max ?? 0,
            ];
            setMinPrice(min);
            setMaxPrice(max);
        }
    }, [searchParams, filters, atributos, brands, priceFilter]);

    if (!filters || filters.length === 0) return null;

    const updateParams = (updates: Record<string, string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, val] of Object.entries(updates)) {
            if (!val || val.length === 0) params.delete(key);
            else {
                params.delete(key);
                val.forEach((v) => params.append(key, v));
            }
        }
        router.push(`/productos?${params.toString()}`);
    };

    const toggleCheckboxValue = (attrName: string, value: string) => {
        const prevValues = selectedFilters[attrName] || [];
        const updatedValues = prevValues.includes(value)
            ? prevValues.filter((v) => v !== value)
            : [...prevValues, value];
        setSelectedFilters({ ...selectedFilters, [attrName]: updatedValues });
        updateParams({ [attrName]: updatedValues });
    };

    const handlePriceChange = (type: "min" | "max", value: string) => {
        const num = Math.max(0, Number(value) || 0);
        if (type === "min") {
            setMinPrice(num);
            updateParams({ priceRange: [`${num}-${maxPrice}`] });
        } else {
            setMaxPrice(num);
            updateParams({ priceRange: [`${minPrice}-${num}`] });
        }
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        atributos.forEach((attr) => (cleared[attr.name] = null));
        cleared["brand"] = null;
        setSelectedFilters({});
        if (priceFilter) {
            setMinPrice(priceFilter.min ?? 0);
            setMaxPrice(priceFilter.max ?? 0);
        }
        updateParams({ ...cleared, priceRange: null, sort: null });
        setOpen(false);
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="w-full cursor-pointer bg-white rounded-md shadow-xs px-3 py-2 flex items-center gap-2 justify-center sm:hidden">
                    <VscSettings size={20} />
                    Filtros
                </button>
            </DrawerTrigger>

            <DrawerContent className="p-4">
                <DrawerHeader className="flex justify-between">
                    <DrawerTitle className="text-lg font-medium text-gray-700">Filtros</DrawerTitle>

                    <button
                        onClick={clearFilters}
                        className="flex justify-end gap-1 text-xs text-red-600 hover:text-red-500 transition"
                    >
                        <MdClear size={18} />
                        Limpiar
                    </button>
                </DrawerHeader>

                {/* Contenido scrolleable */}
                <ScrollArea className="h-[70vh] pr-2 mt-2 overflow-y-auto">
                    {/* ----- Filtro por Precio ----- */}
                    {priceFilter && (
                        <div className="mb-6">
                            <h2 className="text-sm font-medium text-black mb-1 uppercase">Precio</h2>
                            <div className="flex flex-nowrap items-center gap-4 pt-2">
                                <div className="flex flex-col text-xs text-black w-full sm:w-auto">
                                    <label htmlFor="min" className="mb-1">Mín</label>
                                    <input
                                        id="min"
                                        type="number"
                                        min={0}
                                        value={minPrice}
                                        onChange={(e) => handlePriceChange("min", e.target.value)}
                                        className="w-full sm:w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>

                                <span className="text-gray-500 mt-5">-</span>

                                <div className="flex flex-col text-xs text-black w-full sm:w-auto">
                                    <label htmlFor="max" className="mb-1">Máx</label>
                                    <input
                                        id="max"
                                        type="number"
                                        min={0}
                                        value={maxPrice}
                                        onChange={(e) => handlePriceChange("max", e.target.value)}
                                        className="w-full sm:w-24 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ----- Filtros de marcas ----- */}
                    {brands.length > 0 && (
                        <Disclosure>
                            {({ open }) => (
                                <div>
                                    <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-black border-b py-2 hover:bg-gray-100 uppercase">
                                        <span>Marcas</span>
                                        <ChevronUpIcon
                                            className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                        <ul className="space-y-1">
                                            {brands.map((brand) => (
                                                <li
                                                    key={brand.slug}
                                                    onClick={() => toggleCheckboxValue("brand", brand.slug)}
                                                    className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer py-1 rounded-md select-none"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={!!selectedFilters["brand"]?.includes(brand.slug)}
                                                        readOnly
                                                        className="accent-blue-600 pointer-events-none"
                                                    />
                                                    <span className="text-sm text-gray-600">{brand.nombre}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Disclosure.Panel>
                                </div>
                            )}
                        </Disclosure>
                    )}

                    {/* ----- Filtros por atributos dinámicos ----- */}
                    <div className="space-y-4 mt-4">
                        {atributos.map((attr) => (
                            <Disclosure key={attr.name}>
                                {({ open }) => (
                                    <div>
                                        <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-black border-b py-2 hover:bg-gray-100 uppercase">
                                            <span>{attr.name}</span>
                                            <ChevronUpIcon
                                                className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                            <ul className="space-y-1">
                                                {attr.values.map((value) => (
                                                    <li
                                                        key={value}
                                                        onClick={() => toggleCheckboxValue(attr.name, value)}
                                                        className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer py-1 rounded-md select-none"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={!!selectedFilters[attr.name]?.includes(value)}
                                                            readOnly
                                                            className="accent-blue-600 pointer-events-none"
                                                        />
                                                        <span className="text-sm text-gray-600">{value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Disclosure.Panel>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
