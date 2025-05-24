"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdClear } from "react-icons/md";

type Props = {
    categorySlug: string;
};

export default function FiltrosClient({ categorySlug }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const priceRanges = [
        { label: "Todos", value: "" },
        { label: "0 - 100", value: "0-100" },
        { label: "100 - 300", value: "100-300" },
        { label: "300 - 1000", value: "300-1000" },
    ];

    const brandsList = ["Samsung", "Apple", "Xiaomi", "Huawei"];

    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    useEffect(() => {
        setSelectedPrice(searchParams.get("priceRange") || "");
        setSelectedBrands(searchParams.get("brands")?.split(",") || []);
    }, [searchParams]);


    
    const updateParams = (updates: Record<string, string | string[] | null>) => {

        const params = new URLSearchParams(searchParams.toString());
        for (const [key, val] of Object.entries(updates)) {
            if (!val || (Array.isArray(val) && val.length === 0)) {
                params.delete(key);
            } else {
                params.set(key, Array.isArray(val) ? val.join(",") : val);
            }
        }
        router.push(`/categoria/${categorySlug}?${params.toString()}`);
    };

    const onPriceChange = (value: string) => {
        setSelectedPrice(value);
        updateParams({ priceRange: value });
    };

    const onBrandToggle = (brand: string) => {
        const updated = selectedBrands.includes(brand)
            ? selectedBrands.filter((b) => b !== brand)
            : [...selectedBrands, brand];
        setSelectedBrands(updated);
        updateParams({ brands: updated });
    };

    const clearFilters = () => {
        setSelectedPrice("");
        setSelectedBrands([]);
        updateParams({ priceRange: "", brands: null });
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition"
                >
                    <MdClear size={18} className="text-red-500" />
                    Limpiar filtros
                </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900">Filtros</h3>

            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Precio</h4>
                <ul className="space-y-1">
                    {priceRanges.map(({ label, value }) => (
                        <li key={value} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="priceRange"
                                value={value}
                                checked={selectedPrice === value}
                                onChange={() => onPriceChange(value)}
                                className="accent-gray-700"
                            />
                            <label className="text-sm text-gray-600">{label}</label>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Marcas</h4>
                <ul className="space-y-1">
                    {brandsList.map((brand) => (
                        <li key={brand} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => onBrandToggle(brand)}
                                className="accent-gray-700"
                            />
                            <label className="text-sm text-gray-600">{brand}</label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}