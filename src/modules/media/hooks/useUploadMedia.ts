import { useState, useCallback } from 'react';
import { ZodError } from 'zod';
import { MediaService } from '../services/media.service';

import type {
    Media,
    MediaFolder,
    FileUploadState,
    UploadErrorItem,
} from '../types/media.types';
import {
    ALLOWED_IMAGE_MIMETYPES,
    ALLOWED_VIDEO_MIMETYPES,
    MAX_IMAGE_SIZE_BYTES,
    MAX_VIDEO_SIZE_BYTES,
    MAX_FILES_PER_REQUEST,
    SIZE_LABELS,
} from '../types/media.constants';

interface UseUploadMediaOptions {
    folder: MediaFolder;
    accept?: 'image' | 'video' | 'both';
    multiple?: boolean;
    maxFiles?: number;
    onSuccess?: (media: Media[]) => void;
    onError?: (errors: UploadErrorItem[]) => void;
    onPartialSuccess?: (media: Media[], errors: UploadErrorItem[]) => void;
}

interface UseUploadMediaReturn {
    fileStates: FileUploadState[];
    isUploading: boolean;
    globalProgress: number;
    hasErrors: boolean;
    uploadedCount: number;
    failedCount: number;
    upload: (files: File[]) => Promise<void>;
    reset: () => void;
    removeFile: (index: number) => void;
    retryFailed: () => Promise<void>;
    validateFiles: (files: File[]) => { valid: File[]; errors: string[] };
}

export function useUploadMedia(options: UseUploadMediaOptions): UseUploadMediaReturn {
    const {
        folder,
        accept = 'image',
        multiple = false,
        maxFiles = MAX_FILES_PER_REQUEST,
        onSuccess,
        onError,
        onPartialSuccess,
    } = options;

    const [fileStates, setFileStates] = useState<FileUploadState[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [globalProgress, setGlobalProgress] = useState(0);

    // ─── Type Guards y Helpers Seguros ──────────────────────────────────────────

    // Determina si un string pertenece estrictamente al grupo de MimeTypes de Imagen
    const isImageMime = useCallback((type: string): boolean => {
        return (ALLOWED_IMAGE_MIMETYPES as readonly string[]).includes(type);
    }, []);

    const getAllowedMimes = useCallback((): readonly string[] => {
        if (accept === 'image') return ALLOWED_IMAGE_MIMETYPES;
        if (accept === 'video') return ALLOWED_VIDEO_MIMETYPES;
        return [...ALLOWED_IMAGE_MIMETYPES, ...ALLOWED_VIDEO_MIMETYPES];
    }, [accept]);

    const getMaxSize = useCallback((file: File): number => {
        return isImageMime(file.type) ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;
    }, [isImageMime]);

    const getSizeLabel = useCallback((file: File): string => {
        return isImageMime(file.type) ? SIZE_LABELS.image : SIZE_LABELS.video;
    }, [isImageMime]);

    // ─── Validación Cliente ───────────────────────────────────────────────────

    const validateFiles = useCallback(
        (files: File[]): { valid: File[]; errors: string[] } => {
            const errors: string[] = [];
            const allowedMimes = getAllowedMimes();

            if (!multiple && files.length > 1) {
                errors.push('Solo se permite subir un archivo a la vez');
                return { valid: [], errors };
            }

            if (files.length > maxFiles) {
                errors.push(`Máximo ${maxFiles} archivos por subida`);
                return { valid: [], errors };
            }

            const valid = files.filter((file) => {
                if (!allowedMimes.includes(file.type)) {
                    errors.push(`"${file.name}": tipo de archivo no soportado (${file.type || 'desconocido'})`);
                    return false;
                }
                if (file.size > getMaxSize(file)) {
                    errors.push(`"${file.name}": supera el límite de ${getSizeLabel(file)}`);
                    return false;
                }
                return true;
            });

            return { valid, errors };
        },
        [getAllowedMimes, multiple, maxFiles, getMaxSize, getSizeLabel]
    );

    // ─── Upload Core Engine ───────────────────────────────────────────────────

    const upload = useCallback(
        async (files: File[]): Promise<void> => {
            const { valid, errors: validationErrors } = validateFiles(files);

            if (validationErrors.length > 0 && valid.length === 0) {
                onError?.(
                    validationErrors.map((reason, index) => ({
                        index,
                        filename: files[index]?.name ?? 'unknown',
                        reason,
                    }))
                );
                return;
            }

            const incomingStates: FileUploadState[] = valid.map((file) => ({
                file,
                status: 'uploading',
                progress: 0,
                previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            }));

            setFileStates((prev) => {
                const filteredPrev = prev.filter(
                    (ps) => !valid.some((vf) => vf.name === ps.file.name && vf.size === ps.file.size)
                );
                return [...filteredPrev, ...incomingStates];
            });

            setIsUploading(true);
            setGlobalProgress(0);

            try {
                const response = await MediaService.upload(
                    { files: valid, folder },
                    (progress) => {
                        setGlobalProgress(progress);
                        setFileStates((prev) =>
                            prev.map((item) =>
                                valid.some((vf) => vf.name === item.file.name && vf.size === item.file.size) &&
                                    item.status === 'uploading'
                                    ? { ...item, progress }
                                    : item
                            )
                        );
                    }
                );

                const failedIndices = new Set(response.errors?.map((e) => e.index) ?? []);

                setFileStates((prev) =>
                    prev.map((item) => {
                        const validIndex = valid.findIndex((vf) => vf.name === item.file.name && vf.size === item.file.size);
                        if (validIndex === -1) return item;

                        if (failedIndices.has(validIndex)) {
                            const errItem = response.errors?.find((e) => e.index === validIndex);
                            return { ...item, status: 'error', progress: 0, error: errItem?.reason || 'Error en servidor' };
                        }

                        const successIndex = validIndex - [...failedIndices].filter((fi) => fi < validIndex).length;
                        return {
                            ...item,
                            status: 'success',
                            progress: 100,
                            result: response.data[successIndex],
                        };
                    })
                );

                setGlobalProgress(100);

                if (response.failed === 0) {
                    onSuccess?.(response.data);
                } else if (response.uploaded > 0) {
                    onPartialSuccess?.(response.data, response.errors ?? []);
                } else {
                    onError?.(response.errors ?? []);
                }
            } catch (err) {
                const message =
                    err instanceof ZodError ? 'Respuesta inesperada del servidor' :
                        err instanceof Error ? err.message :
                            'Error desconocido al subir archivos';

                setFileStates((prev) =>
                    prev.map((item) =>
                        valid.some((vf) => vf.name === item.file.name && vf.size === item.file.size)
                            ? { ...item, status: 'error', progress: 0, error: message }
                            : item
                    )
                );

                onError?.(valid.map((file, index) => ({ index, filename: file.name, reason: message })));
            } finally {
                setIsUploading(false);
            }
        },
        [folder, validateFiles, onSuccess, onError, onPartialSuccess]
    );

    // ─── Retry Automatizado Sin Pérdida de Contexto ───────────────────────────

    const retryFailed = useCallback(async (): Promise<void> => {
        let filesToRetry: File[] = [];

        setFileStates((prev) => {
            filesToRetry = prev.filter((s) => s.status === 'error').map((s) => s.file);
            return prev.map((item) =>
                item.status === 'error'
                    ? { ...item, status: 'uploading', progress: 0, error: undefined }
                    : item
            );
        });

        if (filesToRetry.length === 0) return;
        await upload(filesToRetry);
    }, [upload]);

    // ─── Desasignación e Inmortalidad de Memoria ──────────────────────────────

    const reset = useCallback(() => {
        setFileStates((prev) => {
            prev.forEach((s) => {
                if (s.previewUrl) URL.revokeObjectURL(s.previewUrl);
            });
            return [];
        });
        setGlobalProgress(0);
        setIsUploading(false);
    }, []);

    const removeFile = useCallback((index: number) => {
        setFileStates((prev) => {
            const item = prev[index];
            if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    // ─── Selectores Derivados Completamente Puros ──────────────────────────────

    const uploadedCount = fileStates.filter((s) => s.status === 'success').length;
    const failedCount = fileStates.filter((s) => s.status === 'error').length;
    const hasErrors = failedCount > 0;

    return {
        fileStates,
        isUploading,
        globalProgress,
        hasErrors,
        uploadedCount,
        failedCount,
        upload,
        reset,
        removeFile,
        retryFailed,
        validateFiles,
    };
}