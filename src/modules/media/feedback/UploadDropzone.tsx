'use client';

import { useRef, useState, useCallback, DragEvent } from 'react';
import type { MediaUploaderBaseProps } from '../types/media.types';
import { ACCEPT_MAP } from '../types/media.constants';

interface UploadDropzoneProps
  extends Pick<MediaUploaderBaseProps, 'accept' | 'multiple' | 'maxFiles' | 'disabled'> {
  onFiles: (files: File[]) => void;
  onValidationError?: (errors: string[]) => void;
  isUploading?: boolean;
  children?: React.ReactNode;
}

export function UploadDropzone({
  accept = 'image',
  multiple = false,
  maxFiles = 10,
  disabled = false,
  isUploading = false,
  onFiles,
  onValidationError,
  children,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const isDisabled = disabled || isUploading;

  // ─── Procesamiento y Validación Coherente ─────────────────────────────────

  const processFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const errors: string[] = [];

      if (!multiple && files.length > 1) {
        errors.push('Solo se permite un archivo a la vez');
        onValidationError?.(errors);
        return;
      }

      if (files.length > maxFiles) {
        errors.push(`Máximo ${maxFiles} archivos por subida`);
        onValidationError?.(errors);
        return;
      }

      onFiles(files);
    },
    [multiple, maxFiles, onFiles, onValidationError]
  );

  // ─── Drag Events ───────────────────────────────────────────────────────────

  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) setIsDragging(true);
  }, [isDisabled]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) setIsDragging(true);
  }, [isDisabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (isDisabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    [isDisabled, processFiles]
  );

  // ─── Input Change ──────────────────────────────────────────────────────────

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files ?? []);
      processFiles(selectedFiles);
      e.target.value = '';
    },
    [processFiles]
  );

  const openFilePicker = useCallback(() => {
    if (!isDisabled) inputRef.current?.click();
  }, [isDisabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFilePicker();
      }
    },
    [isDisabled, openFilePicker]
  );

  return (
    <div
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-label="Zona de carga de archivos. Presione Enter o Barra Espaciadora para abrir el explorador."
      aria-disabled={isDisabled}
      data-dragging={isDragging}
      data-disabled={isDisabled}
      data-uploading={isUploading}
      onClick={(e) => {
        if (e.target !== e.currentTarget && (e.target as HTMLElement).closest('button, a, input')) {
          return;
        }
        openFilePicker();
      }}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'relative flex flex-col items-center justify-center',
        'w-full min-h-[180px] rounded-xl border-2 border-dashed',
        'transition-all duration-200 select-none outline-none',
        isDragging
          ? 'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 scale-[1.01]'
          : 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-hover)] hover:bg-[color:var(--color-muted)]/40',
        isDisabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2',
        !isDragging && !isDisabled
          ? 'border-[color:var(--color-border)] hover:border-[color:var(--color-border-hover)] hover:bg-[color:var(--color-muted)]/40'
          : '',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        multiple={multiple}
        disabled={isDisabled}
        onChange={handleInputChange}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      {isDragging && (
        <div
          className="absolute inset-0 rounded-xl border-2 border-[color:var(--color-primary)] pointer-events-none z-30"
          aria-hidden="true"
        />
      )}

      {children}
    </div>
  );
}