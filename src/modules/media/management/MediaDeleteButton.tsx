'use client';

import { useState, useId, useCallback } from 'react';
import { useDeleteMedia } from '../hooks/useDeleteMedia';
import type { Media } from '../types/media.types';

interface MediaDeleteButtonProps {
  media: Media;
  onDeleted?: (id: string) => void;
  disabled?: boolean;
  variant?: 'icon' | 'text' | 'full';
}

export function MediaDeleteButton({
  media,
  onDeleted,
  disabled = false,
  variant = 'icon',
}: MediaDeleteButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const componentId = useId();

  const { deleteMedia, isDeleting } = useDeleteMedia({
    onSuccess: (id) => {
      // El callback de la grilla remueve el nodo inmediatamente del DOM, 
      // por lo que no forzamos mutaciones sobre un componente desmontado
      onDeleted?.(id);
    },
  });

  const handleConfirm = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el click interactúe con componentes superiores (como MediaCard)
    await deleteMedia(media);
  }, [media, deleteMedia]);

  const handleToggleConfirm = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  }, []);

  const handleCancelConfirm = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  }, []);

  // ── Confirmación Inline Accesible y Segura ──────────────────────────────────

  if (showConfirm) {
    return (
      <div
        role="alertdialog"
        aria-labelledby={`${componentId}-confirm-label`}
        className="flex items-center gap-2 select-none"
        onClick={(e) => e.stopPropagation()} // Bloquea clicks accidentales en el contenedor del minimodal
      >
        <span id={`${componentId}-confirm-label`} className="text-xs text-muted-foreground font-medium">
          ¿Eliminar?
        </span>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isDeleting}
          className={[
            'rounded px-2 py-1 text-xs font-semibold outline-none transition-colors',
            'bg-destructive text-destructive-foreground',
            'hover:bg-destructive/90 disabled:opacity-50',
            'focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-1',
          ].join(' ')}
        >
          {isDeleting ? '...' : 'Sí'}
        </button>
        <button
          type="button"
          onClick={handleCancelConfirm}
          disabled={isDeleting}
          className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          No
        </button>
      </div>
    );
  }

  // ── Variantes del Botón Directo ─────────────────────────────────────────────

  const baseClass = [
    'transition-colors duration-150 outline-none font-medium',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' ');

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggleConfirm}
        disabled={disabled || isDeleting}
        aria-label={`Eliminar recurso multimedial ${media.publicId}`}
        className={`${baseClass} flex items-center justify-center w-7 h-7 rounded-full bg-black/60 text-white text-xs hover:bg-destructive hover:text-white focus-visible:ring-2 focus-visible:ring-destructive`}
      >
        ✕
      </button>
    );
  }

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={handleToggleConfirm}
        disabled={disabled || isDeleting}
        className={`${baseClass} text-sm text-destructive underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-destructive rounded px-1`}
      >
        Eliminar
      </button>
    );
  }

  // variant === 'full'
  return (
    <button
      type="button"
      onClick={handleToggleConfirm}
      disabled={disabled || isDeleting}
      className={`${baseClass} flex items-center gap-2 rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive`}
    >
      <svg 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        aria-hidden="true"
      >
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
      </svg>
      Eliminar
    </button>
  );
}