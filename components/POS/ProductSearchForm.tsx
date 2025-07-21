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

        if (value.trim()) {
            params.set("query", value);
        }

        router.push(`/pos?${params.toString()}`);
    }, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        debouncedPush(value);
    };

    return (
        <div className="relative w-full max-w-lg mx-auto mb-6">
            <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-extrabold"
                size={23}
            />
            <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-800 placeholder-gray-600 placeholder:font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all duration-200"
                value={query}
                onChange={handleChange}
            />
        </div>
    );
}
