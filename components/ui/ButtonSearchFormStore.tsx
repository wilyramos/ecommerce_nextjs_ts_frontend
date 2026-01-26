"use client";

import { Search, History, Loader2, ArrowRight, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import { getSearchHistory, saveSearchTerm } from "@/lib/utils";
import ProductResultSearch from "./home/ProductResultSearch";
import Link from "next/link";

interface Props {
    isMobile?: boolean;
    onSearchComplete?: () => void;
}

export default function ButtonSearchFormStore({ isMobile = false, onSearchComplete }: Props) {

    const router = useRouter();
    const pathname = usePathname();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [history, setHistory] = useState<string[]>([]);
    useEffect(() => setHistory(getSearchHistory()), []);

    const DEFAULT_SUGGESTIONS = ["iphone", "case", "audífonos"];


    const saveHistory = (term: string) => {
        if (!term) return;
        saveSearchTerm(term);
        setHistory(getSearchHistory());
    };

    useEffect(() => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
    }, [pathname]);

    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed || trimmed.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        const data = await searchProductsIndex(trimmed);
        setResults(data || []);
        setLoading(false);
        setIsOpen(true);
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
        onSearchComplete?.();

        router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
    };

    /* CLICK OUTSIDE - ONLY DESKTOP */
    useEffect(() => {
        if (isMobile) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target as Node;

            const insideForm = formRef.current?.contains(target);
            const insideDropdown = dropdownRef.current?.contains(target);

            if (!insideForm && !insideDropdown) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [isMobile]);

    return (
        <>
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className={`relative w-full mx-auto ${isMobile ? "max-w-full px-2" : "max-w-5xl"}`}
            >
                <div
                    className={`
                        relative flex items-center transition-all duration-300
                        bg-[var(--store-bg)] border border-[var(--store-border)]
                        h-10
                        ${isMobile ? "rounded-lg" : "rounded-full bg-[var(--store-surface)]"}
                    `}
                >
                    <div className="pl-3 text-[var(--store-text-muted)]">
                        <Search size={20} />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length > 0) setIsOpen(true);
                        }}
                        placeholder="Buscar productos, marcas..."
                        className="
                            flex-1 px-3 py-2 bg-transparent 
                            text-base md:text-sm 
                            text-[var(--store-text)] placeholder-[var(--store-text-muted)]
                            outline-none w-full
                        "
                        onFocus={() => setIsOpen(true)}
                        autoFocus={isMobile}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setResults([]);
                            }}
                            className="p-2 mr-1 text-[var(--store-text-muted)] hover:text-[var(--store-text)]"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </form>

            {/* DROPDOWN */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className={`
                        bg-[var(--store-surface)] border-b border-[var(--store-border)] z-[1000000] overflow-hidden 
                        ${isMobile
                            ? "absolute top-[calc(100%+1px)] left-0 w-full  h-[calc(100vh-300px)]"
                            : "absolute top-full left-0 w-full max-h-[calc(100vh-200px)] shadow-sm rounded-b-[var(--store-radius)]"
                        }
                    `}
                >
                    <div
                        className={`
                            h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--store-border)] 
                            ${isMobile ? "p-4" : "p-4 max-w-7xl mx-auto"}
                        `}
                    >

                        {/* LOADING */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-8 text-[var(--store-text-muted)]">
                                <Loader2 className="animate-spin mb-2" size={24} />
                                <span className="text-xs font-medium">Buscando...</span>
                            </div>
                        )}

                        {/* HISTORIAL */}
                        {/* HISTORIAL / SUGERENCIAS */}
                        {!loading && !query && (
                            <div>
                                <h4 className="text-xs font-semibold text-[var(--store-text-muted)] uppercase mb-3 flex items-center gap-2">
                                    <History size={14} /> {history.length > 0 ? "Recientes" : "Sugerencias"}
                                </h4>

                                <div className="flex flex-wrap gap-2">
                                    {(history.length > 0 ? history : DEFAULT_SUGGESTIONS).map((term, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setQuery(term)}
                                            className="px-3 py-1.5 bg-[var(--store-bg)] hover:bg-[var(--store-border)] rounded-lg text-xs text-[var(--store-text)] transition-colors"
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* RESULTADOS */}
                        {!loading && results.length > 0 && (
                            <div className="space-y-2">

                                <div className="flex items-center justify-between  ">
                                    <h3 className="font-semibold text-sm text-[var(--store-text)]">Resultados</h3>

                                    <Link
                                        href={`/productos?query=${encodeURIComponent(query)}`}
                                        onClick={() => {
                                            saveHistory(query.trim());
                                            onSearchComplete?.();
                                        }}
                                        className="flex items-center gap-1 text-xs text-[var(--store-primary)] font-semibold hover:underline"
                                    >
                                        Ver todos <ArrowRight size={12} />
                                    </Link>
                                </div>

                                {/* GRID - Mejorado para móviles */}
                                <div className={`
                                    grid gap-3 
                                    ${isMobile ? "grid-cols-2" : "grid-cols-4 md:grid-cols-6"}
                                `}>
                                    {results.slice(0, isMobile ? 8 : 6).map((item) => (
                                        <ProductResultSearch key={item._id} item={item} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SIN RESULTADOS */}
                        {!loading && query && results.length === 0 && (
                            <div className="text-center py-8 text-[var(--store-text-muted)]">
                                <Search size={22} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm font-medium text-[var(--store-text)]">
                                    Sin resultados para “{query}”
                                </p>
                                <p className="text-xs">
                                    Intenta con otra palabra clave.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}