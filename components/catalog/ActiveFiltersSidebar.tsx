"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import { X, RotateCcw } from "lucide-react";

export default function ActiveFiltersSidebar() {
    const { 
        currentSlugs,   
        searchParams, 
        setCategory, 
        setBrand, 
        setLine, 
        updateFilter, 
        clearFilters,
        hasFilters 
    } = useCatalogNav();

    if (!hasFilters) return null;

    return (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Header con botón de limpiar */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--store-text)]">
                    Filtros Activos
                </h3>
                <button
                    onClick={clearFilters}
                    className="text-[10px] font-medium text-[var(--store-text-muted)] hover:text-red-600 flex items-center gap-1 transition-colors group"
                >
                    <RotateCcw className="w-3 h-3 group-hover:-rotate-180 transition-transform duration-500" />
                    Limpiar
                </button>
            </div>

            {/* Lista de Chips Vertical/Compacta */}
            <div className="flex flex-wrap gap-2">
                
                {/* 1. Slugs de URL (Categoría, Marca, Línea) */}
                {currentSlugs.map((slug) => (
                    <FilterChip
                        key={slug}
                        label={slug.replace(/-/g, ' ')}
                        onRemove={() => {
                            setCategory(slug); 
                            setBrand(slug); 
                            setLine(slug);
                        }}
                    />
                ))}

                {/* 2. Query Params */}
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (['page', 'limit', 'sort'].includes(key)) return null;

                    let label = `${key}: ${value}`;
                    if (key === 'priceRange') label = `Precio: S/ ${value.replace('-', ' - S/ ')}`;
                    if (key === 'query') label = `Buscas: "${value}"`;

                    return (
                        <FilterChip
                            key={`${key}-${value}`}
                            label={label}
                            onRemove={() => updateFilter(key, value)}
                        />
                    );
                })}
            </div>
            
            {/* Separador visual elegante */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--store-border)] to-transparent" />
        </div>
    );
}

// Subcomponente Chip Minimalista
function FilterChip({ label, onRemove }: { label: string, onRemove: () => void }) {
    return (
        <button
            onClick={onRemove}
            className="group flex items-center justify-between w-full max-w-full gap-2 px-3 py-1.5 text-xs text-left bg-[var(--store-bg)] border border-transparent hover:border-[var(--store-border)] hover:bg-white rounded-md transition-all duration-200"
        >
            <span className="truncate font-medium text-[var(--store-text)] capitalize">
                {label}
            </span>
            <X className="w-3 h-3 text-[var(--store-text-muted)] group-hover:text-red-500 shrink-0" />
        </button>
    );
}