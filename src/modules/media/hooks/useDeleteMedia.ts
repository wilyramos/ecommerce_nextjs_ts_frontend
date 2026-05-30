import { useState, useCallback } from 'react';
import { MediaService } from '../services/media.service';
import type { Media } from '../types/media.types';

interface UseDeleteMediaOptions {
    onSuccess?: (deletedId: string) => void;
    onError?: (error: string) => void;
}

interface UseDeleteMediaReturn {
    deleteMedia: (media: Media) => Promise<void>;
    isDeleting: boolean;
    deletingId: string | null;
    error: string | null;
    reset: () => void;
}

export function useDeleteMedia(options: UseDeleteMediaOptions = {}): UseDeleteMediaReturn {
    const { onSuccess, onError } = options;

    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deleteMedia = useCallback(
        async (media: Media): Promise<void> => {
            // Si ya está eliminando ese mismo archivo, bloqueamos ejecuciones duplicadas
            if (deletingId === media._id && isDeleting) return;

            setIsDeleting(true);
            setDeletingId(media._id);
            setError(null);

            try {
                await MediaService.deleteById(media._id);

                // Ejecutamos primero el callback para que la lista elimine el nodo antes de limpiar los estados de carga
                onSuccess?.(media._id);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido al eliminar el recurso';

                setError(message);
                onError?.(message);
            } finally {
                setIsDeleting(false);
                setDeletingId(null);
            }
        },
        [onSuccess, onError, deletingId, isDeleting]
    );

    const reset = useCallback(() => {
        setIsDeleting(false);
        setDeletingId(null);
        setError(null);
    }, []);

    return {
        deleteMedia,
        isDeleting,
        deletingId,
        error,
        reset,
    };
}