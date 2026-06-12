import { useState, useCallback } from 'react';

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

    const upload = useCallback(async (files: File[]): Promise<void> => {
        const { valid, errors: validationErrors } = validateFiles(files);

        if (validationErrors.length > 0 && valid.length === 0) {
            onError?.(validationErrors.map((reason, i) => ({
                index: i, filename: files[i]?.name ?? 'unknown', reason,
            })));
            return;
        }

        const incomingStates: FileUploadState[] = valid.map((file) => ({
            file, status: 'uploading', progress: 0,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        }));

        setFileStates((prev) => [...prev.filter(
            (ps) => !valid.some((vf) => vf.name === ps.file.name && vf.size === ps.file.size)
        ), ...incomingStates]);

        setIsUploading(true);
        setGlobalProgress(0);

        const results = await Promise.allSettled(valid.map(async (file) => {
            // 1. Pedir firma al backend

            const signRes = await fetch('/api/media/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder }),
            });
            if (!signRes.ok) throw new Error('Error al firmar la subida');
            const { signature, timestamp, publicId, apiKey, cloudName } = await signRes.json();

            // 2. Subir directo a Cloudinary con XHR para tener progreso
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', String(timestamp));
            formData.append('signature', signature);
            formData.append('public_id', publicId);
            formData.append('folder', folder);

            const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

            const cloudinaryResult = await new Promise<Record<string, unknown>>((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const pct = Math.round((e.loaded / e.total) * 95);
                        setGlobalProgress(pct);
                        setFileStates((prev) => prev.map((item) =>
                            item.file === file ? { ...item, progress: pct } : item
                        ));
                    }
                });
                xhr.addEventListener('load', () => {
                    const json = JSON.parse(xhr.responseText);
                    if (xhr.status >= 400) reject(new Error(json.error?.message ?? `Error ${xhr.status}`));
                    else resolve(json);
                });
                xhr.addEventListener('error', () => reject(new Error('Error de red con Cloudinary')));
                xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);
                xhr.send(formData);
            });

            // 3. Registrar en tu base de datos
            const registerRes = await fetch('/api/media/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secureUrl: cloudinaryResult.secure_url,
                    publicId: cloudinaryResult.public_id,
                    format: cloudinaryResult.format,
                    bytes: cloudinaryResult.bytes,
                    width: cloudinaryResult.width,
                    height: cloudinaryResult.height,
                    duration: cloudinaryResult.duration,
                    resourceType,
                    folder,
                }),
            });
            if (!registerRes.ok) throw new Error('Error al registrar el medio en la base de datos');
            const { data } = await registerRes.json();
            return data;
        }));

        const succeeded: Media[] = [];
        const failed: UploadErrorItem[] = [];

        results.forEach((r, i) => {
            if (r.status === 'fulfilled') {
                succeeded.push(r.value);
                setFileStates((prev) => prev.map((item) =>
                    item.file === valid[i] ? { ...item, status: 'success', progress: 100, result: r.value } : item
                ));
            } else {
                failed.push({ index: i, filename: valid[i].name, reason: r.reason?.message ?? 'Error desconocido' });
                setFileStates((prev) => prev.map((item) =>
                    item.file === valid[i] ? { ...item, status: 'error', progress: 0, error: r.reason?.message } : item
                ));
            }
        });

        setGlobalProgress(100);
        setIsUploading(false);

        if (failed.length === 0) onSuccess?.(succeeded);
        else if (succeeded.length > 0) onPartialSuccess?.(succeeded, failed);
        else onError?.(failed);

    }, [folder, validateFiles, onSuccess, onError, onPartialSuccess]);

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