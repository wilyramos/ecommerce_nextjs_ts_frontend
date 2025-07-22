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
            className="px-3 py-2 border border-gray-300 rounded-full text-sm w-full sm:w-64"
            placeholder="Buscar por nombre o SKU..."
            value={query}
            onChange={onChange}
        />
    );
}