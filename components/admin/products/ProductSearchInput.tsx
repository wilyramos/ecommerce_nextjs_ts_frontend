'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function ProductSearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [query, setQuery] = useState(() => searchParams.get('query') || '');

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams();

        if (value.trim()) {
            params.set('query', value);
        } else {
            params.delete('query');
        }

        router.push(`${pathname}?${params.toString()}`);
    }, 500);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        handleSearch(value);
    };

    return (
        <input
            type="text"
            value={query}
            onChange={onChange}
            placeholder="Buscar productos..."
            className="w-full max-w-md px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
    );
}
