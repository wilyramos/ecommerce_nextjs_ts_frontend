"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LuX } from "react-icons/lu";

export default function ActiveFiltersChips() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const entries = Array.from(params.entries()).filter(
        ([key]) => !["page", "limit", "sort"].includes(key)
    );

    if (entries.length === 0) return null;

    const removeFilter = (key: string) => {
        const newParams = new URLSearchParams(params.toString());
        newParams.delete(key);

        const queryString = newParams.toString();
        // scroll: false evita que la página salte al inicio al quitar un filtro
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    };

    const clearAll = () => {
        router.push(pathname, { scroll: false });
    };

    const formatValue = (text: string) => {
        return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="flex flex-wrap items-center gap-2 py-1 animate-in fade-in slide-in-from-left-2 duration-300">
            {entries.map(([key, value]) => (
                <button
                    key={`${key}-${value}`}
                    onClick={() => removeFilter(key)}
                    className="group flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold border border-[var(--store-border)] rounded-full bg-[var(--store-bg)] text-[var(--store-text)] hover:bg-[var(--store-border)] transition-all duration-200 active:scale-95"
                >
                    <span className="font-bold text-[8px] opacity-70">{formatValue(key)}:</span>
                    <span className="tracking-tight">{formatValue(value)}</span>
                    <LuX className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                </button>
            ))}

            {entries.length > 1 && (
                <button
                    onClick={clearAll}
                    className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--store-primary)] hover:opacity-70 transition-opacity ml-2"
                >
                    Limpiar todo
                </button>
            )}
        </div>
    );
}