// File: frontend/components/catalog/hooks/useCatalogNav.ts
"use client";

import { useRouter, useSearchParams, useParams, usePathname } from "next/navigation";
import { useMemo, useCallback } from "react";

export function useCatalogNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const pathname = usePathname(); // ← FIX: faltaba este import

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
            const newPath = newSlugs.length > 0
                ? `/catalogo/${newSlugs.join('/')}`
                : '/catalogo';
            router.push(createUrl(newPath));
            return;
        }
        const newPath = `/catalogo/${[...slugs, brandSlug].join('/')}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    const setLine = useCallback((lineSlug: string) => {
        if (slugs.includes(lineSlug)) {
            const newSlugs = slugs.filter(s => s !== lineSlug);
            const newPath = newSlugs.length > 0
                ? `/catalogo/${newSlugs.join('/')}`
                : '/catalogo';
            router.push(createUrl(newPath));
        } else {
            const newPath = `/catalogo/${[...slugs, lineSlug].join('/')}`;
            router.push(createUrl(newPath));
        }
    }, [slugs, router, createUrl]);

    const isCategoryActive = useCallback((slug: string) => slugs.includes(slug), [slugs]);
    const isBrandActive    = useCallback((slug: string) => slugs.includes(slug), [slugs]);
    const isLineActive     = useCallback((slug: string) => slugs.includes(slug), [slugs]);

    const updateFilter = useCallback((key: string, value: string) => {
        const next = new URLSearchParams(searchParams.toString());

        // Parámetros de valor único: siempre reemplazar (fix del sort duplicado)
        const singleValueKeys = ['sort', 'page', 'priceMin', 'priceMax'];

        if (singleValueKeys.includes(key)) {
            next.set(key, value);
        } else {
            // Toggle multi-valor (atributos, colores…)
            const current = next.getAll(key);
            if (current.includes(value)) {
                next.delete(key);
                current.filter(v => v !== value).forEach(v => next.append(key, v));
            } else {
                next.append(key, value);
            }
        }

        // Resetear siempre a página 1 al cambiar cualquier filtro que no sea page/sort
        if (key !== 'page' && key !== 'sort') {
            next.delete('page');
        }

        router.push(`${pathname}?${next.toString()}`);
    }, [searchParams, pathname, router]);

    // FIX: hasFilters solo mira query params reales, no slugs de ruta
    // Los slugs son parte de la navegación, no "filtros activos" en el sentido UX
    const hasActiveQueryFilters = useMemo(() => {
        for (const [key] of searchParams.entries()) {
            // Ignorar sort=recientes (valor por defecto) y page
            if (key === 'page') continue;
            if (key === 'sort' && searchParams.get('sort') === 'recientes') continue;
            return true;
        }
        return false;
    }, [searchParams]);

    const clearFilters = useCallback(() => {
        // Solo limpia query params, mantiene el path (slugs de ruta)
        router.push(pathname);
    }, [router, pathname]);

    const setPriceRange = useCallback((min: number, max: number) => {
        const next = new URLSearchParams(searchParams.toString());
        next.set('priceMin', String(min));
        next.set('priceMax', String(max));
        next.delete('page');
        router.push(`${pathname}?${next.toString()}`);
    }, [searchParams, pathname, router]);

    const clearPriceRange = useCallback(() => {
        const next = new URLSearchParams(searchParams.toString());
        next.delete('priceMin');
        next.delete('priceMax');
        next.delete('page');
        router.push(`${pathname}?${next.toString()}`);
    }, [searchParams, pathname, router]);

    return {
        currentSlugs: slugs,
        hasFilters: hasActiveQueryFilters,

        isCategoryActive,
        isBrandActive,
        isLineActive,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        setPriceRange,
        clearPriceRange,
        clearFilters,
        searchParams,
        pathname,
    };
}