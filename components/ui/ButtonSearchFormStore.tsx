"use client";

import { Search, History, Loader2, ArrowRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "./home/ProductResultSearch";

export default function ButtonSearchFormStore() {
    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLFormElement>(null);
    const [history, setHistory] = useState<string[]>([]);

    useEffect(() => setHistory(getSearchHistory()), []);

    const saveHistory = (term: string) => {
        if (!term) return;
        saveSearchTerm(term);
        setHistory(getSearchHistory());
    };

    // Limpiar al cambiar de ruta
    useEffect(() => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    }, [pathname]);

    // Búsqueda con debounce con al menos 3 caracteres
    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();

        if (!trimmed || trimmed.length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        setLoading(true);
        const data = await searchProductsIndex(trimmed);
        setResults(data || []);
        setIsOpen(true);
        setLoading(false);
    }, 400);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        saveHistory(trimmed);
        setIsOpen(false);
        setResults([]);
        router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form ref={containerRef} className="relative" onSubmit={handleSubmit}>
            {/* Input con tonos neutros */}
            <div className="flex items-center bg-gray-100 dark:bg-neutral-800 rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-400 focus-within:bg-white dark:focus-within:bg-neutral-900">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos, categorías..."
                    className="flex-1 px-4 py-2.5 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
                    onFocus={() => setIsOpen(true)}
                />
                <button
                    type="submit"
                    className="px-4 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
                    aria-label="Buscar"
                >
                    <Search size={18} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl max-h-[70vh] overflow-y-auto overflow-hidden">
                    {/* Loading */}
                    {loading && (
                        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            Buscando...
                        </div>
                    )}

                    {/* Historial si no hay query */}
                    {!query && history.length > 0 && (
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                                Búsquedas recientes
                            </h4>
                            <ul className="space-y-1">
                                {history.map((h, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 p-2 -m-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                                        onMouseDown={() => setQuery(h)}
                                    >
                                        <History size={14} /> {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Resultados */}
                    {results.length > 0 ? (
                        <>
                            {/* Ver todos */}
                            <div
                                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer border-b border-gray-200 dark:border-neutral-800"
                                onMouseDown={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                                }}
                            >
                                <span>Ver todos los resultados</span>
                                <ArrowRight size={14} />
                            </div>

                            <ul className="p-2">
                                {results.map((item) => (
                                    <ProductResultSearch
                                        key={item._id}
                                        item={item}
                                    />
                                ))}
                            </ul>
                        </>
                    ) : (
                        !loading &&
                        query && (
                            <div className="p-6 text-sm text-center text-gray-500 dark:text-gray-400">
                                No encontramos resultados para “{query}”.
                                <span
                                    className="block mt-2 font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:underline"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setIsOpen(false);
                                        router.push("/productos");
                                    }}
                                >
                                    Ver todos los productos
                                </span>
                            </div>
                        )
                    )}
                </div>
            )}
        </form>
    );
}
