// File: src/modules/media/hooks/useMediaList.ts
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { MediaService } from '../services/media.service';
import type { Media, MediaFolder, MediaListResponse } from '../types/media.types';

interface UseMediaListOptions {
    folder: MediaFolder;
    limit?: number;
    autoFetch?: boolean;
}

interface UseMediaListReturn {
    media: Media[];
    total: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    hasMore: boolean;
    fetchPage: (page: number) => Promise<void>;
    fetchNextPage: () => Promise<void>;
    refresh: () => Promise<void>;
    removeFromList: (id: string) => void;
    prependToList: (items: Media[]) => void;
}

export function useMediaList(options: UseMediaListOptions): UseMediaListReturn {
    const { folder, limit = 20, autoFetch = true } = options;

    const [media, setMedia] = useState<Media[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const abortRef = useRef<AbortController | null>(null);

    // ─── Fetch Central Pura ───────────────────────────────────────────────────

    const fetchPage = useCallback(
        async (page: number): Promise<void> => {
            if (abortRef.current) {
                abortRef.current.abort();
            }
            const controller = new AbortController();
            abortRef.current = controller;

            const isFirstPage = page === 1;
            if (isFirstPage) {
                setIsLoading(true);
            } else {
                setIsFetchingMore(true);
            }
            setError(null);

            try {
                // Inyección directa y tipada de la señal de control de red
                const response: MediaListResponse = await MediaService.list(
                    { folder, page, limit },
                    { signal: controller.signal }
                );

                setTotal(response.total);
                setTotalPages(response.pages);
                setCurrentPage(page);

                setMedia((prev) => (isFirstPage ? response.data : [...prev, ...response.data]));
            } catch (err) {
                // Tipado seguro contra la interfaz nativa DOMException de AbortController
                if (err instanceof DOMException && err.name === 'AbortError') return;
                if (err instanceof Error && err.message.includes('aborted')) return;

                setError(err instanceof Error ? err.message : 'Error al cargar los recursos');
            } finally {
                if (abortRef.current === controller) {
                    setIsLoading(false);
                    setIsFetchingMore(false);
                }
            }
        },
        [folder, limit]
    );

    // ─── Ciclo de Vida ─────────────────────────────────────────────────────────

    useEffect(() => {
        setMedia([]);
        setTotal(0);
        setTotalPages(0);
        setCurrentPage(1);
        setError(null);

        if (autoFetch) {
            fetchPage(1);
        }

        return () => {
            if (abortRef.current) {
                abortRef.current.abort();
            }
        };
    }, [folder, autoFetch, fetchPage]);

    // ─── Acciones Derivadas ────────────────────────────────────────────────────

    const hasMore = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);

    const fetchNextPage = useCallback(async (): Promise<void> => {
        if (!hasMore || isFetchingMore || isLoading) return;
        await fetchPage(currentPage + 1);
    }, [hasMore, isFetchingMore, isLoading, currentPage, fetchPage]);

    const refresh = useCallback(async (): Promise<void> => {
        await fetchPage(1);
    }, [fetchPage]);

    // ─── Mutaciones Locales ────────────────────────────────────────────────────

    const removeFromList = useCallback((id: string) => {
        setMedia((prev) => prev.filter((item) => item._id !== id));
        setTotal((prev) => Math.max(0, prev - 1));
    }, []);

    const prependToList = useCallback((items: Media[]) => {
        setMedia((prev) => {
            const uniqueIncoming = items.filter((newMedia) => !prev.some((pm) => pm._id === newMedia._id));
            return [...uniqueIncoming, ...prev];
        });
        setTotal((prev) => prev + items.length);
    }, []);

    return {
        media,
        total,
        totalPages,
        currentPage,
        isLoading,
        isFetchingMore,
        error,
        hasMore,
        fetchPage,
        fetchNextPage,
        refresh,
        removeFromList,
        prependToList,
    };
}