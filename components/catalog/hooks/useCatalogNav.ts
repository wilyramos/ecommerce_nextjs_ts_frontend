"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useCallback } from "react";

export function useCatalogNav() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    
    // Obtenemos los slugs actuales como array simple
    const slugs = (params.slug as string[]) || [];

    // Helper: mantiene query params al navegar
    const createUrl = useCallback((newSlugs: string[]) => {
        const path = newSlugs.length > 0 
            ? `/catalogo/${newSlugs.join('/')}` 
            : '/catalogo';
            
        const paramsString = searchParams.toString();
        return paramsString ? `${path}?${paramsString}` : path;
    }, [searchParams]);

    // =======================================================
    // LÓGICA DE TOGGLE GENÉRICA (Para Cats, Brands, Lines)
    // =======================================================
    // Esta función verifica si el slug ya existe. 
    // Si existe -> Lo quita (Desactivar filtro)
    // Si no existe -> Lo agrega (Activar filtro)
    
    const toggleSlug = useCallback((targetSlug: string) => {
        let newSlugs = [...slugs];

        if (newSlugs.includes(targetSlug)) {
            // SI YA EXISTE: Lo removemos
            newSlugs = newSlugs.filter(s => s !== targetSlug);
        } else {
            // SI NO EXISTE: Lo agregamos al final
            newSlugs.push(targetSlug);
        }

        router.push(createUrl(newSlugs));
    }, [slugs, router, createUrl]);


    // Funciones específicas para la UI (aunque todas usan toggleSlug, 
    // las separamos por si en el futuro quieres lógica diferente para c/u)
    
    const setCategory = useCallback((slug: string) => {
        // Para categorías, a veces queremos que sea "Raíz". 
        // Si cambio de categoría, quizás quiera borrar marcas/líneas.
        // Pero para robustez simple, usamos el toggle o reemplazo.
        
        // OPCIÓN ROBUSTA: Si es categoría, reemplazamos el primer slug si existe, o limpiamos todo.
        // Pero dado tu diseño flexible, Toggle es lo más seguro.
        toggleSlug(slug);
    }, [toggleSlug]);

    const setBrand = useCallback((slug: string) => toggleSlug(slug), [toggleSlug]);
    const setLine = useCallback((slug: string) => toggleSlug(slug), [toggleSlug]);

    // Helpers para saber si un checkbox debe estar marcado
    const isCategoryActive = (slug: string) => slugs.includes(slug);
    const isBrandActive = (slug: string) => slugs.includes(slug);
    const isLineActive = (slug: string) => slugs.includes(slug);

    // Contexto actual (Opcional, para breadcrumbs simples)
    const currentCategory = slugs[0] || null;
    const currentBrand = slugs.find(s => s !== slugs[0]) || null;
    const currentLine = slugs[slugs.length - 1] || null;

    // Filtros de atributos (Query Params)
    const updateFilter = useCallback((key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('page');

        if (['sort', 'min', 'max'].includes(key)) {
             newParams.set(key, value);
        } else {
            if (newParams.has(key, value)) {
                newParams.delete(key, value);
            } else {
                newParams.append(key, value);
            }
        }
        const pathname = window.location.pathname;
        router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    }, [searchParams, router]);

    const clearFilters = useCallback(() => {
        router.push(window.location.pathname);
    }, [router]);

    return {
        // Estado
        currentSlugs: slugs,
        hasFilters: slugs.length > 0 || searchParams.toString().length > 0,
        
        // Helpers de UI (Booleanos)
        isCategoryActive,
        isBrandActive,
        isLineActive,
        
        // Acciones
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        clearFilters,
        searchParams,

        // Legacy support (opcional)
        currentCategory,
        currentBrand, 
        currentLine
    };
}