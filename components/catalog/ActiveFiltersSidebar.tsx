// File: frontend/components/catalog/ActiveFiltersSidebar.tsx
"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import { X, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ActiveFiltersSidebar() {
    const { currentSlugs, searchParams, updateFilter, clearPriceRange, hasFilters } = useCatalogNav();
    const router = useRouter();

    const hasSlugs = currentSlugs.length > 0;
    const visible = hasSlugs || hasFilters;

    if (!visible) return null;

    const removeSlug = (slugToRemove: string) => {
        const remainingSlugs = currentSlugs.filter(s => s !== slugToRemove);
        const newPath = remainingSlugs.length > 0 ? `/catalogo/${remainingSlugs.join('/')}` : '/catalogo';
        const query = searchParams.toString();
        router.push(query ? `${newPath}?${query}` : newPath);
    };

    const getLabelForParam = (key: string, value: string): string => {
        if (key === 'priceMin' || key === 'priceMax') return '';
        if (key === 'query') return `"${value}"`;
        const keyLabel = key.charAt(0).toUpperCase() + key.slice(1);
        const valLabel = value.charAt(0).toUpperCase() + value.slice(1);
        return `${keyLabel}: ${valLabel}`;
    };

    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const hasPriceFilter = priceMin !== null || priceMax !== null;

    const fmt = (n: string) =>
        new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(Number(n));

    const HIDDEN_KEYS = new Set(['page', 'limit', 'sort', 'priceMin', 'priceMax']);
    const queryChips = [];

    for (const [key, value] of searchParams.entries()) {
        if (HIDDEN_KEYS.has(key)) continue;
        const label = getLabelForParam(key, value);
        if (label) queryChips.push({ key, value, label });
    }

    return (
        <div className="mb-6 select-none animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-3.5 pb-1 border-b border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    Filtros activos
                </span>
                <button
                    onClick={() => router.push('/catalogo')}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-action-cta transition-colors outline-none cursor-pointer"
                >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Limpiar todo
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {currentSlugs.map((slug) => (
                    <Chip key={slug} label={slug.replace(/-/g, " ")} onRemove={() => removeSlug(slug)} />
                ))}

                {hasPriceFilter && (
                    <Chip
                        label={`${priceMin ? fmt(priceMin) : '–'} – ${priceMax ? fmt(priceMax) : '–'}`}
                        onRemove={clearPriceRange}
                    />
                )}

                {queryChips.map(({ key, value, label }) => (
                    <Chip key={`${key}-${value}`} label={label} onRemove={() => updateFilter(key, value)} />
                ))}
            </div>
        </div>
    );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            onClick={onRemove}
            className={cn(
                "group inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-none",
                "text-primary bg-background border border-border",
                "hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150 outline-none cursor-pointer"
            )}
        >
            <span className="truncate max-w-[150px] font-medium capitalize">{label}</span>
            <X className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
        </button>
    );
}