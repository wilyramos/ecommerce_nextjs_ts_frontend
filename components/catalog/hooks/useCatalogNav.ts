"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useCallback } from "react";

export function useCatalogNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();

    // Obtenemos los slugs actuales
    const slugs = (params.slug as string[]) || [];

    // Helper base para crear URLs manteniendo query params (precio, sort, etc)
    const createUrl = useCallback((newPath: string) => {
        const paramsString = searchParams.toString();
        return paramsString ? `${newPath}?${paramsString}` : newPath;
    }, [searchParams]);

    // =======================================================
    // 🧠 LÓGICA DE NAVEGACIÓN (REEMPLAZO, NO TOGGLE)
    // =======================================================

    // 1. Categorías: Son mutuamente excluyentes (generalmente)
    // Si estoy en /catalogo/celulares y clic en Audio -> /catalogo/audio
    // Si estoy en /catalogo y clic en Audio -> /catalogo/audio
    const setCategory = useCallback((categorySlug: string) => {
        // Si ya estoy en esa categoría, no hago nada (o podría quitarla si quisieras toggle)
        if (slugs.includes(categorySlug)) return;

        // ESTRATEGIA: Reemplazo total. 
        // Asumimos que al cambiar de categoría, el usuario quiere ver ESA categoría limpia.
        // Si quieres mantener la marca (ej: Apple) al cambiar de categoría, sería más complejo.
        // Aquí simplificamos a: Clic en categoría = Ir a esa categoría.
        const newPath = `/catalogo/${categorySlug}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    // 2. Marcas: Se pueden sumar a una categoría existente
    const setBrand = useCallback((brandSlug: string) => {
        // Si ya está activa, la quitamos (Toggle)
        if (slugs.includes(brandSlug)) {
            const newSlugs = slugs.filter(s => s !== brandSlug);
            const newPath = newSlugs.length > 0 ? `/catalogo/${newSlugs.join('/')}` : '/catalogo';
            router.push(createUrl(newPath));
            return;
        }

        // Si NO está activa, la agregamos
        // Pero primero verificamos si ya hay OTRA marca (para no tener /apple/samsung)
        // (Esto requiere saber cuáles slugs son marcas, pero como no lo sabemos en el frontend simple,
        // simplemente agregamos al final. El backend resolverá con "Last Win").

        // Opción segura: Agregar al final
        const newPath = `/catalogo/${[...slugs, brandSlug].join('/')}`;
        router.push(createUrl(newPath));
    }, [slugs, router, createUrl]);

    // 3. Líneas: Igual que marcas
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

    // Helpers de UI
    const isCategoryActive = (slug: string) => slugs.includes(slug);
    const isBrandActive = (slug: string) => slugs.includes(slug);
    const isLineActive = (slug: string) => slugs.includes(slug);

    // Filtros de atributos (Query Params) - Se mantiene igual
    const updateFilter = useCallback((key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('page'); // Reset página al filtrar

        // Lógica de Toggle para checkbox
        if (newParams.has(key, value)) {
            newParams.delete(key, value);
        } else {
            newParams.append(key, value);
        }

        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const clearFilters = useCallback(() => {
        // Limpiar solo query params, mantener la ruta actual
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
        searchParams
    };
}