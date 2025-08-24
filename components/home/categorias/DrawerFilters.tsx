"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Attribute } from "@/src/schemas";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Range } from "react-range";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

type Props = {
    categorySlug: string;
    attributes: Attribute[];
};

const MIN = 0;
const MAX = 3000;

export default function DrawerFilters({ categorySlug, attributes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [priceValues, setPriceValues] = useState<[number, number]>([MIN, MAX]);

    useEffect(() => {
        const filters: Record<string, string[]> = {};

        attributes.forEach((attr) => {
            const param = searchParams.get(attr.name);
            if (param) {
                filters[attr.name] = param.split(",");
            }
        });

        setSelectedFilters(filters);

        const range = searchParams.get("priceRange");
        const [min, max] = range?.split("-").map(Number) || [MIN, MAX];
        setPriceValues([min, max]);
    }, [searchParams, attributes]);

    const updateParams = (updates: Record<string, string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        for (const [key, val] of Object.entries(updates)) {
            if (val === null || val.length === 0) {
                params.delete(key);
            } else {
                params.set(key, val.join(","));
            }
        }

        router.push(`/categoria/${categorySlug}?${params.toString()}`);
    };

    const toggleCheckboxValue = (attrName: string, value: string) => {
        const prevValues = selectedFilters[attrName] || [];
        let updatedValues: string[];

        if (prevValues.includes(value)) {
            updatedValues = prevValues.filter((v) => v !== value);
        } else {
            updatedValues = [...prevValues, value];
        }

        const newFilters = { ...selectedFilters, [attrName]: updatedValues };
        setSelectedFilters(newFilters);
        updateParams({ [attrName]: updatedValues });
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        attributes.forEach((attr) => (cleared[attr.name] = null));
        setSelectedFilters({});
        setPriceValues([MIN, MAX]);
        updateParams({
            ...cleared,
            priceRange: null,
            sort: null,
        });
    };

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="flex items-center gap-1 text-black font-semibold bg-white px-2 py-1 rounded-xl shadow-md">
                    <VscSettings size={20} />
                    Filtros
                </button>
            </DrawerTrigger>

            <DrawerContent className="p-4">
                <DrawerHeader className="flex justify-between items-center">
                    <DrawerTitle className="text-lg font-medium text-gray-700">Filtros</DrawerTitle>
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                    >
                        <MdClear size={18} />
                        Limpiar
                    </button>
                </DrawerHeader>

                {/* Contenido scrolleable */}
                <ScrollArea className="h-auto pr-2 mt-2">
                    {/* Filtro de precio */}
                    <div className="mb-6">
                        <h2 className="text-sm font-medium text-black mb-1">Precio</h2>
                        <Range
                            step={10}
                            min={MIN}
                            max={MAX}
                            values={priceValues}
                            onChange={(values) => setPriceValues([values[0], values[1]])}
                            onFinalChange={(values) => {
                                const rangeValue = `${values[0]}-${values[1]}`;
                                updateParams({ priceRange: [rangeValue] });
                            }}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="w-full h-2 bg-gray-200 rounded-full"
                                    style={{ padding: "0 12px" }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => {
                                const { key, ...rest } = props;
                                return (
                                    <div
                                        key={key}
                                        {...rest}
                                        className="w-4 h-4 bg-indigo-600 rounded-full shadow-md transition-transform duration-150 ease-out"
                                    />
                                );
                            }}
                        />
                        <div className="flex justify-between text-xs text-black pt-2 px-1">
                            <span>S/ {priceValues[0]}</span>
                            <span>S/ {priceValues[1]}</span>
                        </div>
                    </div>

                    {/* Filtros por atributos */}
                    <div className="space-y-4">
                        {attributes.map((attr) => (
                            <Disclosure key={attr.name}>
                                {({ open }) => (
                                    <div>
                                        <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-black border-b py-2 hover:bg-gray-100">
                                            <span>{attr.name}</span>
                                            <ChevronUpIcon
                                                className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                            <ul className="space-y-1">
                                                {attr.values.map((value) => (
                                                    <li
                                                        key={value}
                                                        className="flex items-center gap-2 hover:bg-gray-100 cursor-pointer py-1"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={`${attr.name}-${value}`}
                                                            value={value}
                                                            checked={!!selectedFilters[attr.name]?.includes(value)}
                                                            onChange={() => toggleCheckboxValue(attr.name, value)}
                                                            className="accent-blue-600"
                                                        />
                                                        <label className="text-sm text-gray-600">{value}</label>
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
