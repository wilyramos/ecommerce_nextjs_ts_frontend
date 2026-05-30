// File: src/modules/media/components/uploaders/MediaUploader.tsx
'use client';

import { useCallback } from 'react';
import {
  ImageIcon,
  VideoIcon,
  Loader2Icon,
  CheckCircle2Icon,
} from 'lucide-react';

import { UploadDropzone } from '../feedback/UploadDropzone';
import { UploadProgress } from '../feedback/UploadProgress';
import { UploadError } from '../feedback/UploadError';
import { useUploadMedia } from '../hooks/useUploadMedia';

import type { MediaUploaderBaseProps } from '../types/media.types';

import {
  FOLDER_LABELS,
  SIZE_LABELS,
} from '../types/media.constants';

export function MediaUploader({
  folder,
  accept = 'image',
  multiple = false,
  maxFiles = 1,
  disabled = false,
  aspectRatio,
  onSuccess,
  onError,
}: MediaUploaderBaseProps) {
  const {
    fileStates,
    isUploading,
    globalProgress,
    hasErrors,
    uploadedCount,
    failedCount,
    upload,
    reset,
    retryFailed,
    validateFiles,
  } = useUploadMedia({
    folder,
    accept,
    multiple,
    maxFiles,
    onSuccess,
    onError,
    onPartialSuccess: (media, errors) => {
      onSuccess?.(media);
      onError?.(errors);
    },
  });

  // ─── Errores globales vs errores por archivo ──────────────────────────────

  const globalError =
    hasErrors && uploadedCount === 0 && failedCount > 0
      ? fileStates.find((s) => s.status === 'error')?.error ?? null
      : null;

  const fileErrors =
    hasErrors && uploadedCount > 0
      ? fileStates
          .filter((s) => s.status === 'error')
          .map((s, i) => ({
            index: i,
            filename: s.file.name,
            reason: s.error ?? 'Error desconocido',
          }))
      : [];

  const handleFiles = useCallback(
    (files: File[]) => {
      const { valid, errors } = validateFiles(files);

      if (errors.length > 0 && valid.length === 0) {
        onError?.(
          errors.map((reason, i) => ({
            index: i,
            filename: files[i]?.name ?? '',
            reason,
          }))
        );

        return;
      }

      upload(valid);
    },
    [validateFiles, upload, onError]
  );

  const showProgress = fileStates.length > 0;
  const showSuccess = uploadedCount > 0 && !isUploading;

  // ─── Labels descriptivos ──────────────────────────────────────────────────

  const acceptLabel =
    accept === 'both'
      ? 'imágenes y videos'
      : accept === 'image'
        ? 'imágenes'
        : 'videos';

  const sizeLabel =
    accept === 'both'
      ? `imágenes hasta ${SIZE_LABELS.image} · videos hasta ${SIZE_LABELS.video}`
      : `hasta ${SIZE_LABELS[accept]}`;

  const UploadIcon = isUploading
    ? Loader2Icon
    : accept === 'video'
      ? VideoIcon
      : ImageIcon;

  return (
    <div className="w-full space-y-3">
      {/* Dropzone */}
      <UploadDropzone
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        disabled={disabled}
        isUploading={isUploading}
        onFiles={handleFiles}
        onValidationError={(errors) =>
          onError?.(
            errors.map((reason, i) => ({
              index: i,
              filename: '',
              reason,
            }))
          )
        }
      >
        <div className="pointer-events-none flex flex-col items-center gap-3 px-6 py-2 text-center">
          {/* Ícono */}
          <div
            className="bg-muted flex h-12 w-12 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <UploadIcon
              className={`h-6 w-6 text-muted-foreground ${
                isUploading ? 'animate-spin' : ''
              }`}
            />
          </div>

          {/* Texto principal */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isUploading
                ? 'Subiendo archivos...'
                : `Arrastra ${acceptLabel} aquí`}
            </p>

            <p className="text-xs text-muted-foreground">
              o haz clic para seleccionar
            </p>
          </div>

          {/* Metadata */}
          {!isUploading && (
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>Carpeta: {FOLDER_LABELS[folder]}</span>

              {multiple && <span>Máx. {maxFiles} archivos</span>}

              <span>{sizeLabel}</span>

              {aspectRatio && aspectRatio !== 'free' && (
                <span>Relación {aspectRatio}</span>
              )}
            </div>
          )}
        </div>
      </UploadDropzone>

      {/* Progreso */}
      {showProgress && (
        <UploadProgress
          fileStates={fileStates}
          globalProgress={globalProgress}
          uploadedCount={uploadedCount}
          failedCount={failedCount}
          totalCount={fileStates.length}
        />
      )}

      {/* Éxito total */}
      {showSuccess && failedCount === 0 && (
        <div className="flex items-center justify-between rounded-lg border border-success/30 bg-success/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="h-4 w-4 text-success" />

            <p className="text-sm font-medium text-success">
              {uploadedCount} archivo
              {uploadedCount > 1 ? 's' : ''} subido
              {uploadedCount > 1 ? 's' : ''} correctamente
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Limpiar
          </button>
        </div>
      )}

      {/* Errores */}
      <UploadError
        globalError={globalError}
        fileErrors={fileErrors}
        onRetry={hasErrors ? retryFailed : undefined}
        onDismiss={hasErrors ? reset : undefined}
      />
    </div>
  );
}