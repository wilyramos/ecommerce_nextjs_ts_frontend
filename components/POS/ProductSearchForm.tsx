"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";



export default function ProductSearchForm() {


    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') || '');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/pos?query=${query}`);
    }
    return (
        <form
            onSubmit={handleSubmit}
            className="mb-4 flex items-center gap-2"
        >
            <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full rounded border border-gray-300 p-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Buscar
            </button>
        </form>
    );
}