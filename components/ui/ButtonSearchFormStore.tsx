"use client";

import { FaSearch, FaClock, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "./home/ProductResultSearch";
import { usePathname } from "next/navigation";

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

    // Búsqueda con debounce
    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
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
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <form ref={containerRef} className="relative w-full" onSubmit={handleSubmit}>
            {/* Input */}
            <div className="flex items-center border border-gray-300 rounded-2xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos, categorías..."
                    className="flex-1 px-4 py-2 text-gray-700 placeholder-gray-400 outline-none"
                    onFocus={() => setIsOpen(true)}
                />
                <button
                    type="submit"
                    className="px-4 text-gray-600 hover:text-black"
                    aria-label="Buscar"
                >
                    <FaSearch size={16} />
                </button>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto">
                    {/* Loading */}
                    {loading && <div className="p-4 text-sm text-gray-500">Buscando...</div>}

                    {/* Historial si no hay query */}
                    {!query && history.length > 0 && (
                        <div className="p-3">
                            <h4 className="text-xs text-gray-400 mb-2">Búsquedas recientes</h4>
                            <ul className="space-y-2">
                                {history.map((h, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 cursor-pointer text-sm"
                                        onClick={() => setQuery(h)}
                                    >
                                        <FaClock size={12} /> {h}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results.length > 0 ? (
                        <>
                            {/* Ver todos (primera fila) */}
                            <div
                                className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 cursor-pointer "
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    saveHistory(query);
                                    setIsOpen(false);
                                    router.push(`/productos?query=${encodeURIComponent(query)}`);
                                }}
                            >
                                Ver todos los resultados para “{query}” <FaArrowRight size={12} />
                            </div>

                            {/* Resultados */}
                            <ul className="">
                                {results.map((item) => (
                                    <ProductResultSearch key={item._id} item={item} />
                                ))}
                            </ul>
                        </>
                    ) : (
                        !loading &&
                        query && (
                            <div className="p-4 text-sm text-gray-500">
                                No encontramos resultados.
                                <span
                                    className="block mt-1 text-gray-800 cursor-pointer hover:underline"
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
