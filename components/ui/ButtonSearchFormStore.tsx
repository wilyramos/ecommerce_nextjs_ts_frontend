"use client";

import { FaSearch } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ButtonSearchFormStore() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Leer el valor actual del parámetro "query" del URL en el cliente
        const params = new URLSearchParams(window.location.search);
        const currentQuery = params.get('query') || '';
        setQuery(currentQuery);
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            router.push(`/productos?query=${encodeURIComponent(trimmed)}`);
        } else {
            router.push('/productos');
        }
    };

    return (
        <form className="flex w-full" onSubmit={handleSubmit}>
            <div className="flex items-center w-full border border-gray-500 rounded-full overflow-hidden">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué estás buscando?"
                    className="flex-1 px-4 py-1.5 text-sm text-gray-700 bg-transparent placeholder-gray-500 outline-none font-normal"
                />
                <button
                    type="submit"
                    className="px-4 text-gray-500 hover:text-indigo-600 transition"
                    aria-label="Buscar"
                >
                    <FaSearch size={14} />
                </button>
            </div>
        </form>
    );
}
