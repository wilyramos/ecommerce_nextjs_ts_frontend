"use client";

import { useRouter, useSearchParams } from "next/navigation";

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
        <select
            defaultValue={searchParams.get("sort") || ""}
            onChange={(e) => handleSortChange(e.target.value)}
            className="p-2 rounded border text-sm"
        >
            {sortOptions.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
    );
}
