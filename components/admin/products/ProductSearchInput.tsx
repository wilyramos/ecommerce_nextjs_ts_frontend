'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductSearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [query, setQuery] = useState(searchParams.get('query') || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (query) {
                params.set('query', query);
            } else {
                params.delete('query');
            }
            router.push(`/admin/products?${params.toString()}`);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [query, router, searchParams]);

    return (
        <input
            type="text"
            className="px-3 py-2 border border-gray-300 rounded-full text-sm w-full sm:w-64"
            placeholder="Buscar por nombre o SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />
    );
}
