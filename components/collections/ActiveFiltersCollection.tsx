// File: frontend/components/collections/ActiveFiltersCollection.tsx

"use client";

import { useCollectionNav } from "./hooks/useCollectionNav";
import { X, RotateCcw } from "lucide-react";

export default function ActiveFiltersCollection() {
    const {
        searchParams,
        setCategory,
        setBrand,
        setLine,
        updateFilter,
        clearFilters,
        hasFilters,
    } = useCollectionNav();

    if (!hasFilters) return null;

    return (
        <div className="mb-6 select-none">
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.08em] font-bold text-muted-foreground">
                    Filtros activos
                </span>
                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-action-cta transition-colors duration-150 outline-none"
                >
                    <RotateCcw className="w-3 h-3" />
                    Limpiar
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {/* Categoría — exclusiva, un solo valor */}
                {searchParams.getAll("categoria").map((slug) => (
                    <Chip
                        key={`categoria-${slug}`}
                        label={slug.replace(/-/g, " ")}
                        onRemove={() => setCategory(slug)}
                    />
                ))}

                {/* Marcas */}
                {searchParams.getAll("brand").map((slug) => (
                    <Chip
                        key={`brand-${slug}`}
                        label={slug.replace(/-/g, " ")}
                        onRemove={() => setBrand(slug)}
                    />
                ))}

                {/* Líneas */}
                {searchParams.getAll("line").map((slug) => (
                    <Chip
                        key={`line-${slug}`}
                        label={slug.replace(/-/g, " ")}
                        onRemove={() => setLine(slug)}
                    />
                ))}

                {/* Atributos y resto de filtros */}
                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (["page", "limit", "sort", "categoria", "brand", "line"].includes(key)) return null;

                    let label = `${key}: ${value}`;
                    if (key === "priceRange") label = `S/ ${value.replace("-", " – S/ ")}`;
                    if (key === "query")      label = `"${value}"`;

                    return (
                        <Chip
                            key={`${key}-${value}`}
                            label={label}
                            onRemove={() => updateFilter(key, value)}
                        />
                    );
                })}
            </div>

            <div className="mt-5 border-t border-border" />
        </div>
    );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            onClick={onRemove}
            className="group inline-flex items-center gap-2 pl-3 pr-2 py-1.5 text-[12px] font-medium text-foreground bg-background-secondary border border-border rounded-sm hover:border-muted-foreground hover:bg-background transition-colors duration-150 outline-none"
        >
            <span className="capitalize truncate max-w-[160px] leading-none">
                {label}
            </span>
            <X className="w-3 h-3 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors duration-150" />
        </button>
    );
}