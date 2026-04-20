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
        hasFilters,
    } = useCatalogNav();

    if (!hasFilters) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <span
                    className="text-[11px] uppercase tracking-[0.06em]"
                    style={{ color: "var(--color-text-tertiary)" }}
                >
                    Filtros activos
                </span>

                <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-[12px] transition-colors duration-150"
                    style={{ color: "var(--color-text-tertiary)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--color-accent-warm)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-tertiary)")}
                >
                    <RotateCcw className="w-[11px] h-[11px]" />
                    Limpiar
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {currentSlugs.map((slug) => (
                    <Chip
                        key={slug}
                        label={slug.replace(/-/g, " ")}
                        onRemove={() => {
                            setCategory(slug);
                            setBrand(slug);
                            setLine(slug);
                        }}
                    />
                ))}

                {Array.from(searchParams.entries()).map(([key, value]) => {
                    if (["page", "limit", "sort"].includes(key)) return null;

                    let label = `${key}: ${value}`;
                    if (key === "priceRange") label = `S/ ${value.replace("-", " – S/ ")}`;
                    if (key === "query") label = `"${value}"`;

                    return (
                        <Chip
                            key={`${key}-${value}`}
                            label={label}
                            onRemove={() => updateFilter(key, value)}
                        />
                    );
                })}
            </div>

            <div
                className="mt-5 border-t"
                style={{ borderColor: "var(--color-border-subtle)" }}
            />
        </div>
    );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <button
            onClick={onRemove}
            className="group inline-flex items-center gap-1.5 pl-3 pr-2.5 py-[5px] text-[12px] rounded transition-all duration-150"
            style={{
                color: "var(--color-text-primary)",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border-default)",
            }}
            onMouseEnter={e => {
                (e.currentTarget.style.borderColor = "var(--color-border-strong)");
            }}
            onMouseLeave={e => {
                (e.currentTarget.style.borderColor = "var(--color-border-default)");
            }}
        >
            <span className="capitalize truncate max-w-[160px] leading-none">
                {label}
            </span>
            <X
                className="w-[10px] h-[10px] flex-shrink-0 transition-colors duration-150"
                style={{ color: "var(--color-text-tertiary)" }}
            />
        </button>
    );
}