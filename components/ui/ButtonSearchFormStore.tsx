"use client";

import { FaSearch, FaClock, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import Image from "next/image";
import { createPortal } from "react-dom";

export default function ButtonSearchFormStore() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLFormElement>(null);

    const [coords, setCoords] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);

    // Historial en localStorage
    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("search-history") || "[]");
        setHistory(saved);
    }, []);

    const saveHistory = (term: string) => {
        if (!term) return;
        const updated = [term, ...history.filter((h) => h !== term)].slice(0, 5);
        setHistory(updated);
        localStorage.setItem("search-history", JSON.stringify(updated));
    };

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

    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    }, [isOpen, results]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        saveHistory(trimmed);
        setIsOpen(false);
        setResults([]);
        router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
    };

    const handleSelectItem = (item: TProductListSchema) => {
        saveHistory(query);
        setQuery("");
        setIsOpen(false);
        router.push(`/productos/${item.slug}`);
    };

    // Cerrar al hacer clic fuera (form + portal)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const formEl = containerRef.current;
            const portalEl = document.getElementById("search-results");

            if (
                formEl &&
                !formEl.contains(target) &&
                portalEl &&
                !portalEl.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <form ref={containerRef} className="relative w-full" onSubmit={handleSubmit}>
            {/* Input moderno */}
            <div className="flex items-center w-full border border-gray-300 rounded-2xl overflow-hidden shadow-sm focus-within:shadow-md transition bg-white">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos, categorías..."
                    className="flex-1 px-4 py-2 text-md text-gray-700 bg-transparent placeholder-gray-400 outline-none"
                    onFocus={() => setIsOpen(true)}
                />
                <button
                    type="submit"
                    className="px-4 text-gray-800 hover:text-black transition"
                    aria-label="Buscar"
                >
                    <FaSearch size={16} />
                </button>
            </div>

            {isOpen &&
                coords &&
                createPortal(
                    <div
                        id="search-results"
                        className="absolute z-[9999] bg-white border border-gray-200 rounded-xl shadow-xl max-h-[70vh] overflow-y-auto animate-fade-in pointer-events-auto"
                        style={{
                            position: "absolute",
                            top: coords.top,
                            left: coords.left,
                            width: coords.width,
                        }}
                    >
                        {/* Loading */}
                        {loading && (
                            <div className="p-4 text-sm text-gray-500">Buscando...</div>
                        )}

                        {/* Historial si no hay query */}
                        {!query && history.length > 0 && (
                            <div className="p-3">
                                <h4 className="text-xs text-gray-400 mb-2">
                                    Búsquedas recientes
                                </h4>
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

                        {/* Resultados */}
                        {results.length > 0 ? (
                            <>
                                <ul className="divide-y">
                                    {results.slice(0, 6).map((item) => (
                                        <li
                                            key={item._id}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition"
                                            onMouseDown={() => handleSelectItem(item)}
                                        >
                                            {item.imagenes?.[0] ? (
                                                <Image
                                                    src={item.imagenes[0]}
                                                    alt={item.nombre}
                                                    width={56}
                                                    height={56}
                                                    className="w-14 h-14 rounded-lg object-cover border"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-200 rounded-lg" />
                                            )}
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-gray-800 text-sm font-medium truncate">
                                                    {item.nombre}
                                                </span>
                                                <span className="text-gray-800 font-bold text-sm">
                                                    S/. {item.precio?.toFixed(2)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {/* Ver todos */}
                                <div
                                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-800 font-medium hover:bg-indigo-50 cursor-pointer"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        saveHistory(query);
                                        setIsOpen(false);
                                        router.push(
                                            `/productos?query=${encodeURIComponent(query)}`
                                        );
                                    }}
                                >
                                    Ver todos los resultados para “{query}”{" "}
                                    <FaArrowRight size={12} />
                                </div>
                            </>
                        ) : (
                            !loading &&
                            query && (
                                <div className="p-4 text-sm text-gray-500">
                                    No encontramos resultados.
                                    <span className="block mt-1 text-gray-800 cursor-pointer hover:underline">
                                        Ver todos los productos
                                    </span>
                                </div>
                            )
                        )}
                    </div>,
                    document.body
                )}
        </form>
    );
}