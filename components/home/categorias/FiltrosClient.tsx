"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";
import type { Attribute } from "@/src/schemas";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

type Props = {
    categorySlug: string;
    attributes: Attribute[];
};

export default function FiltrosClient({ categorySlug, attributes }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

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
        <aside className="py-6 border-gray-200">
            <div className="flex justify-end mb-4">
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition"
                >
                    <MdClear size={18} />
                    Limpiar filtros
                </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h3>

            <div className="space-y-4">
                {attributes.map(attr => (
                    <Disclosure key={attr.name}>
                        {({ open }) => (
                            <div>
                                <Disclosure.Button className="flex justify-between w-full text-sm font-medium text-gray-700 border-b py-2">
                                    <span>{attr.name}</span>
                                    <ChevronUpIcon className={`w-5 h-5 transform transition-transform ${open ? "rotate-180" : ""}`} />
                                </Disclosure.Button>
                                <Disclosure.Panel className="pt-2 pl-1 text-sm text-gray-600">
                                    <ul className="space-y-1">
                                        {attr.values.map(value => (
                                            <li key={value} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[attr.name]?.includes(value) || false}
                                                    onChange={() => toggleValue(attr.name, value)}
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
        </aside>
    );
}
