// File: frontend/components/collections/hooks/useCollectionNav.ts
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCollectionNav() {
    const router       = useRouter();
    const searchParams = useSearchParams();

    const toggleParam = useCallback((key: string, value: string, exclusive = false) => {
        const next = new URLSearchParams(searchParams.toString());
        next.delete("page");

        if (next.has(key, value)) {
            next.delete(key, value);
        } else {
            if (exclusive) next.delete(key);
            next.append(key, value);
        }

        router.push(`${window.location.pathname}?${next.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const setCategory = useCallback((slug: string) => toggleParam("categoria", slug, true),  [toggleParam]);
    const setBrand    = useCallback((slug: string) => toggleParam("brand",     slug, false), [toggleParam]);
    const setLine     = useCallback((slug: string) => toggleParam("line",      slug, false), [toggleParam]);

    const updateFilter = useCallback((key: string, value: string) => toggleParam(key, value, false), [toggleParam]);

    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    const isCategoryActive = useCallback((slug: string) =>
        searchParams.getAll("categoria").includes(slug), [searchParams]);

    const isBrandActive = useCallback((slug: string) =>
        searchParams.getAll("brand").includes(slug), [searchParams]);

    const isLineActive = useCallback((slug: string) =>
        searchParams.getAll("line").includes(slug), [searchParams]);

    return {
        hasFilters:       searchParams.toString().length > 0,
        searchParams,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        clearFilters,
    };
}