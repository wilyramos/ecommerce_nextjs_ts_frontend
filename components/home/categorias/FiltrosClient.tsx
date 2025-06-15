"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import type { Attribute } from "@/src/schemas";

type Props = {
    categorySlug: string;
    attributes: Attribute[];
};

export default function FiltrosClient({ categorySlug, attributes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    // Cargar filtros seleccionados desde la URL
    useEffect(() => {
        const filters: Record<string, string[]> = {};
        attributes.forEach(attr => {
            const param = searchParams.get(attr.name);
            if (param) filters[attr.name] = param.split(",");
        });
        setSelectedFilters(filters);
    }, [searchParams, attributes]);

    const updateParams = (updates: Record<string, string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        for (const [key, val] of Object.entries(updates)) {
            if (!val || val.length === 0) {
                params.delete(key);
            } else {
                params.set(key, val.join(","));
            }
        }

        router.push(`/categoria/${categorySlug}?${params.toString()}`);
    };

    const toggleValue = (attrName: string, value: string) => {
        const current = selectedFilters[attrName] || [];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        const newFilters = { ...selectedFilters, [attrName]: updated };
        setSelectedFilters(newFilters);
        updateParams({ [attrName]: updated });
    };

    const clearFilters = () => {
        const cleared: Record<string, null> = {};
        attributes.forEach(attr => cleared[attr.name] = null);
        setSelectedFilters({});
        updateParams(cleared);
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                >
                    <MdClear size={18} className="text-red-500" />
                    Limpiar filtros
                </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>

            {attributes.map(attr => (
                <div key={attr.name}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{attr.name}</h4>
                    <ul className="space-y-1">
                        {attr.values.map(value => (
                            <li key={value} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters[attr.name]?.includes(value) || false}
                                    onChange={() => toggleValue(attr.name, value)}
                                    className="accent-gray-700"
                                />
                                <label className="text-sm text-gray-600">{value}</label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}