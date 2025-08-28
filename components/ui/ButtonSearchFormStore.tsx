"use client";

import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchProductsIndex } from "@/actions/product/get-list-products-search";
import type { TProductListSchema } from "@/src/schemas";
import Image from "next/image";

export default function ButtonSearchFormStore() {

    // Para manejar la búsqueda de productos sin desplegable
    /** const router = useRouter();
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Leer el valor actual del parámetro "query" del URL en el cliente
        const params = new URLSearchParams(window.location.search);
        const currentQuery = params.get('query') || '';
        setQuery(currentQuery);
    }, []);

    // Buscar productos dando click
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
        } else {
            router.push('/productos');
        }
    };
 */
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductListSchema[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLFormElement>(null);

    // Debounced search
    const debouncedSearch = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        const data = await searchProductsIndex(trimmed);
        setResults(data || []);
        setIsOpen(data && data.length > 0);
    }, 400);

    // Ejecutar búsqueda al cambiar el query
    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    // Leer query desde URL al cargar
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const currentQuery = params.get("query") || "";
        setQuery(currentQuery);
    }, []);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        setIsOpen(false);
        if (trimmed) router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
        else router.push("/productos");
    };

    const handleSelectItem = (item: TProductListSchema) => {
        setQuery(""); // limpiar query al seleccionar
        setIsOpen(false);
        router.push(`/productos/${item.slug}`);
    };

    return (
        <form ref={containerRef} className="relative w-full" onSubmit={handleSubmit}>
            <div className="flex items-center w-full border border-gray-300 rounded-full overflow-hidden">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="flex-1 px-4 py-1.5 text-md text-gray-700 bg-transparent placeholder-gray-700 outline-none"
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />
                <button
                    type="submit"
                    className="px-4 text-black hover:text-gray-600 transition"
                    aria-label="Buscar"
                >
                    <FaSearch size={14} />
                </button>
            </div>

            {/* Desplegable de resultados */}
            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {results.map((item) => (
                        <li
                            key={item._id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectItem(item)}
                        >
                            {item.imagenes && item.imagenes.length > 0 ? (
                                <Image
                                    src={item.imagenes[0]}
                                    alt={item.nombre}
                                    width={50}
                                    height={50}
                                    className="object-cover rounded-md"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-md" />
                            )}
                            <span className="text-gray-700 text-sm truncate">{item.nombre}</span>
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
}
