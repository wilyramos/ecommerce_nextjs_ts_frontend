// File: frontend/components/catalog/hooks/useCatalogNav.ts
"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useMemo, useCallback } from "react";

export function useCatalogNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();

    const slugs = useMemo(() => {
        const raw = params.slug;
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        return [raw];
    }, [params.slug]);

    const createUrl = useCallback((newPath: string) => {
        const paramsString = searchParams.toString();
        return paramsString ? `${newPath}?${paramsString}` : newPath;
    }, [searchParams]);

    const setCategory = useCallback((categorySlug: string) => {
        if (slugs.includes(categorySlug)) return;
        const newPath = `/catalogo/${categorySlug}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    const setBrand = useCallback((brandSlug: string) => {
        if (slugs.includes(brandSlug)) {
            const newSlugs = slugs.filter(s => s !== brandSlug);
            const newPath = newSlugs.length > 0 ? `/catalogo/${newSlugs.join('/')}` : '/catalogo';
            router.push(createUrl(newPath));
            return;
        }
        const newPath = `/catalogo/${[...slugs, brandSlug].join('/')}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    const setLine = useCallback((lineSlug: string) => {
        if (slugs.includes(lineSlug)) {
            const newSlugs = slugs.filter(s => s !== lineSlug);
            const newPath = newSlugs.length > 0 ? `/catalogo/${newSlugs.join('/')}` : '/catalogo';
            router.push(createUrl(newPath));
        } else {
            const newPath = `/catalogo/${[...slugs, lineSlug].join('/')}`;
            router.push(createUrl(newPath));
        }
    }, [slugs, router, createUrl]);

    const isCategoryActive = (slug: string) => slugs.includes(slug);
    const isBrandActive    = (slug: string) => slugs.includes(slug);
    const isLineActive     = (slug: string) => slugs.includes(slug);

    const updateFilter = useCallback((key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('page');

        if (newParams.has(key, value)) {
            newParams.delete(key, value);
        } else {
            newParams.append(key, value);
        }

        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    return {
        currentSlugs: slugs,
        hasFilters: slugs.length > 0 || searchParams.toString().length > 0,
        isCategoryActive,
        isBrandActive,
        isLineActive,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        clearFilters,
        searchParams,
    };
}