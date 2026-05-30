'use client';

import { useEffect, useRef } from 'react';
import { MediaCard } from './MediaCard';
import type { Media } from '../types/media.types';

interface MediaGridProps {
    media: Media[];
    isLoading?: boolean;
    isFetchingMore?: boolean;
    hasMore?: boolean;
    error?: string | null;

    // Selección
    selectable?: boolean;
    selectedIds?: Set<string>;
    canSelectMore?: boolean;
    onSelect?: (media: Media) => void;

    // Acciones
    onDelete?: (media: Media) => void;
    onLoadMore?: () => void; // infinite scroll o botón "cargar más"

    // Layout
    columns?: 2 | 3 | 4 | 5;
    emptyMessage?: string;
}

const COLUMNS_CLASS: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
};

export function MediaGrid({
    media,
    isLoading = false,
    isFetchingMore = false,
    hasMore = false,
    error = null,
    selectable = false,
    selectedIds = new Set(),
    canSelectMore = true,
    onSelect,
    onDelete,
    onLoadMore,
    columns = 4,
    emptyMessage = 'No hay archivos en esta carpeta',
}: MediaGridProps) {
    const sentinelRef = useRef<HTMLDivElement>(null);

    // ── Infinite Scroll Eficiente y Controlado ────────────────────────────────

    // Agrupamos las banderas reactivas en una sola referencia mutable para que el Observer no se reconstruya
    const triggerRef = useRef({ hasMore, isFetchingMore, onLoadMore });

    useEffect(() => {
        triggerRef.current = { hasMore, isFetchingMore, onLoadMore };
    }, [hasMore, isFetchingMore, onLoadMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !onLoadMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const { hasMore: currentHasMore, isFetchingMore: currentIsFetchingMore, onLoadMore: currentOnLoadMore } = triggerRef.current;

                if (entries[0]?.isIntersecting && currentHasMore && !currentIsFetchingMore && currentOnLoadMore) {
                    currentOnLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [onLoadMore]);

    // ── Estados de Interfaz ────────────────────────────────────────────────────

    if (isLoading) {
        return <MediaGridSkeleton columns={columns} count={8} />;
    }

    if (error) {
        return (
            <div
                role="alert"
                className="flex flex-col items-center justify-center py-16 gap-2 text-center select-none"
            >
                <span className="text-3xl" aria-hidden="true">⚠</span>
                <p className="text-sm font-semibold text-destructive">{error}</p>
            </div>
        );
    }

    if (media.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center select-none">
                <span className="text-4xl" aria-hidden="true">📂</span>
                <p className="text-sm text-muted-foreground font-medium">{emptyMessage}</p>
            </div>
        );
    }

    // ── Grid Principal ─────────────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            <ul
                role="list"
                className={`grid gap-3 ${COLUMNS_CLASS[columns]}`}
                aria-label="Galería de medios"
            >
                {media.map((item) => {
                    const isSelected = selectedIds.has(item._id);
                    const isDisabled = selectable && !isSelected && !canSelectMore;

                    return (
                        <li
                            key={item._id}
                            className={`transition-opacity duration-200 ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <MediaCard
                                media={item}
                                selectable={selectable}
                                selected={isSelected}
                                onSelect={onSelect}
                                onDelete={onDelete}
                            />
                        </li>
                    );
                })}

                {/* Skeleton de paginación asíncrona */}
                {isFetchingMore &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <li key={`fetching-skeleton-${i}`}>
                            <SkeletonCard />
                        </li>
                    ))}
            </ul>

            {/* Sentinel visible únicamente si hay más páginas por procesar */}
            {onLoadMore && hasMore && (
                <div ref={sentinelRef} className="h-2 w-full" aria-hidden="true" />
            )}

            {/* Corregido: Botón manual se renderiza solo si hasMore es verdadero y NO hay un scroll infinito activo */}
            {hasMore && !onLoadMore && (
                <div className="flex justify-center pt-2">
                    <button
                        type="button"
                        onClick={onLoadMore}
                        disabled={isFetchingMore}
                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-2 py-1 disabled:opacity-50"
                    >
                        {isFetchingMore ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Skeletons con Clases Nativas ─────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-lg overflow-hidden border border-border bg-muted animate-pulse" aria-hidden="true">
            {/* Corregido: bg-muted-neutral cambiado por bg-muted-foreground/10 para asegurar compatibilidad nativa */}
            <div className="aspect-square bg-muted-foreground/10" />
            <div className="px-2 py-1.5 space-y-2 bg-background">
                <div className="h-3 bg-muted-foreground/10 rounded w-3/4" />
                <div className="h-2.5 bg-muted-foreground/10 rounded w-1/2" />
            </div>
        </div>
    );
}

function MediaGridSkeleton({ columns, count }: { columns: number; count: number }) {
    return (
        <ul
            role="list"
            aria-label="Cargando galería de medios"
            aria-busy="true"
            className={`grid gap-3 ${COLUMNS_CLASS[columns]}`}
        >
            {Array.from({ length: count }).map((_, i) => (
                <li key={`initial-skeleton-${i}`}>
                    <SkeletonCard />
                </li>
            ))}
        </ul>
    );
}