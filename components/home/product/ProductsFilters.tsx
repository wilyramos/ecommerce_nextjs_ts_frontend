"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoryListResponse } from "@/src/schemas";
import { MdClear } from "react-icons/md";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Range } from "react-range";


export default function ProductsFilters({ categorias }: { categorias: CategoryListResponse }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        category: "",
        priceRange: "",
    });

    // Filter price

    const [priceValues, setPriceValues] = useState([0, 3000]);

    useEffect(() => {

        const range = searchParams.get("priceRange");
        const [min, max] = range?.split('-').map(Number) || [0, 3000];
        setPriceValues([min, max]);

        setFilters({
            category: searchParams.get("category") || "",
            priceRange: range || "",
        });
    }, [searchParams]);

    const updateFilters = (newFilters: Partial<typeof filters>) => {
        const updatedFilters = { ...filters, ...newFilters };
        const params = new URLSearchParams();
        Object.entries(updatedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        router.push(`/productos?${params.toString()}`);
    };

    return (
        <aside className="py-6 border-gray-200 font-bold">
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => updateFilters({ category: "", priceRange: "" })}
                    className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition text-xs"
                >
                    <MdClear size={18} />
                    Limpiar filtros
                </button>
            </div>

            <div className="space-y-4">
                {/* CATEGORÍA - con Disclosure */}
                <Disclosure>
                    {({ open }) => (
                        <div>
                            <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700 border-b py-2">
                                <span>Categoría</span>
                                <ChevronUpIcon className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`} />
                            </Disclosure.Button>
                            <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                <ul className="space-y-1">
                                    {categorias.map((categoria) => (
                                        <li key={categoria.slug} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={categoria.slug}
                                                checked={filters.category === categoria.slug}
                                                onChange={() => updateFilters({ category: categoria.slug })}
                                                className="accent-blue-600"
                                            />
                                            <label className="text-sm text-gray-600">{categoria.nombre}</label>
                                        </li>
                                    ))}
                                </ul>
                            </Disclosure.Panel>
                        </div>
                    )}
                </Disclosure>

                {/* PRECIO - sin Disclosure (siempre visible) */}
                <div>
                    <div className="text-sm font-medium text-gray-700 border-b py-2">Precio</div>
                    <div className="pt-4">
                        <Range
                            step={10}
                            min={0}
                            max={3000}
                            values={priceValues}
                            onChange={(values) => setPriceValues(values)}
                            onFinalChange={(values) => {
                                updateFilters({ priceRange: `${values[0]}-${values[1]}` });
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
                                    <div key={key} {...rest} className="w-4 h-4 bg-indigo-600 rounded-full shadow-md transition-transform duration-150 ease-out" />
                                );
                            }}

                        />

                        <div className="flex justify-between text-base font-semibold text-gray-500 pt-2 px-1">
                            <span>s/. {priceValues[0]}</span>
                            <span>s/. {priceValues[1]}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}