"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HiOutlineSortDescending } from "react-icons/hi"; // icono moderno

const sortOptions = [
    { label: "Relevancia", value: "" },
    { label: "Precio: menor a mayor", value: "price-asc" },
    { label: "Precio: mayor a menor", value: "price-desc" },
    { label: "Nombre: A-Z", value: "name-asc" },
    { label: "Nombre: Z-A", value: "name-desc" },
];

export default function OrdenarPor({ pathname }: { pathname?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white shadow-sm">
            <HiOutlineSortDescending className="text-indigo-600 text-xl" />
            <select
                defaultValue={searchParams.get("sort") || ""}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white text-sm text-gray-700 border-none focus:outline-none focus:ring-0"
            >
                {sortOptions.map(({ label, value }) => (
                    <option key={value} value={value} className="text-gray-800">
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}
