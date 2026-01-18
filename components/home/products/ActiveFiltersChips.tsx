"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LuX } from "react-icons/lu";

export default function ActiveFiltersChips() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const entries = Array.from(params.entries()).filter(
        ([key]) => !["page", "sort"].includes(key)
    );

    if (entries.length === 0) return null;

    const removeFilter = (key: string) => {
        const newParams = new URLSearchParams(params.toString());
        newParams.delete(key);

        const queryString = newParams.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    const clearAll = () => {
        router.push(pathname);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {entries.map(([key, value]) => (
                <button
                    key={`${key}-${value}`}
                    onClick={() => removeFilter(key)}
                    className="flex items-center gap-1 px-3 py-1 text-xs border rounded-full bg-[var(--store-surface)] hover:bg-gray-100 transition"
                >
                    <span className="capitalize">{key}:</span> {value}
                    <LuX size={12} />
                </button>
            ))}

            {entries.length > 1 && (
                <button
                    onClick={clearAll}
                    className="text-xs text-red-500 hover:underline ml-2"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}
