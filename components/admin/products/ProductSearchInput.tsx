'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function ProductSearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(() => searchParams.get('query') || '');

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams();

        if (value.trim()) {
            params.set('query', value);
        } else {
            params.delete('query');
        }

        router.push(`/admin/products?${params.toString()}`);
    }, 500); // 500ms debounce

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    return (
        <input
            type="text"
            className="w-full max-w-xl px-4 py-2 rounded-full border border-slate-300 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Buscar por nombre o SKU..."
            value={query}
            onChange={onChange}
        />
    );
}
