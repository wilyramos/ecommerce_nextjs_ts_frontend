"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function ProductSearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query") || "");

    const debouncedPush = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams();
        if (value.trim()) params.set("query", value);
        router.push(`/pos?${params.toString()}`);
    }, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedPush(value);
    };

    return (
        <div className="relative w-full mx-auto mb-2">
            <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                size={20}
            />

            <input
                type="text"
                placeholder="Buscar productos..."
                className="
                    w-full rounded-xl border border-slate-300 
                    py-2 pl-12 pr-4 bg-white
                    text-slate-700 placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-blue-600 
                    focus:border-transparent transition-all
                    hover:border-blue-400
                "
                value={query}
                onChange={handleChange}
            />
        </div>
    );
}
