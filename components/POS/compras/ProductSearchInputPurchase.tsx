"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import type { ProductResponse } from "@/src/schemas";



export default function ProductSearchInputPurchase() {



    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [query, setQuery] = useState("");

    // Inicializar el input con lo que haya en la URL
    useEffect(() => {
        const search = searchParams.get("q") || "";
        setQuery(search);
    }, [searchParams]);

    // Callback con debounce (espera 500ms después de escribir)
    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set("q", value);
        } else {
            params.delete("q");
        }
        router.push(`${pathname}?${params.toString()}`);
    }, 500);

    return (
        <div className="flex items-center w-full max-w-4xl rounded-2xl overflow-hidden bg-gray-100">
            {/* Input búsqueda */}
            <div className="relative flex-1">
                <input
                    type="text"
                    placeholder="Buscar producto"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        handleSearch(e.target.value);
                    }}
                    className="w-full bg-gray-100 py-2 pl-10 pr-4 focus:outline-none placeholder:font-bold placeholder:text-sm"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
        </div>
    );
}
