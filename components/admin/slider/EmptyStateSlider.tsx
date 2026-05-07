import { Layers } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export default function EmptyStateSlider({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
                style={{
                    background: "var(--color-bg-tertiary)",
                    border: "1px solid var(--color-border-subtle)",
                }}
            >
                <Layers className="h-5 w-5" strokeWidth={1.5} style={{ color: "var(--color-text-tertiary)" }} />
            </div>

            <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                {hasFilters ? "Sin resultados para los filtros aplicados" : "No hay banners creados"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                {hasFilters ? "Prueba ajustando los filtros" : "Crea tu primer banner para empezar"}
            </p>

            {!hasFilters && (
                <Link
                    href="/admin/slider/new"
                    className="mt-5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    style={{
                        background: "var(--color-action-primary)",
                        color: "var(--color-text-inverse)",
                    }}
                >
                    Crear banner
                </Link>
            )}
        </div>
    );
}