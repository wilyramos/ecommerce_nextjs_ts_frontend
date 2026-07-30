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
        return `${keyLabel}: ${value}`;
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
        <div className="mb-6 select-none animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Filtros Activos
                </span>
                <button
                    onClick={() => router.push('/catalogo')}
                    className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary transition-colors outline-none cursor-pointer"
                >
                    <RotateCcw className="w-3 h-3" />
                    Limpiar
                </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {currentSlugs.map((slug) => (
                    <Chip key={slug} label={slug.replace(/-/g, " ")} onRemove={() => removeSlug(slug)} />
                ))}
                {hasPriceFilter && (
                    <Chip
                        label={`${priceMin ? fmt(priceMin) : '–'} a ${priceMax ? fmt(priceMax) : '–'}`}
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
                "group inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1 text-[11px] font-medium rounded-md border transition-all duration-150 outline-none cursor-pointer",
                "text-foreground bg-background border-border",
                "hover:border-primary hover:bg-muted/30"
            )}
        >
            <span className="truncate max-w-[150px] capitalize">{label}</span>
            <X className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
    );
}