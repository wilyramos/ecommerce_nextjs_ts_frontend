'use client';

import type { UploadErrorItem } from '../types/media.types';

interface UploadErrorProps {
  globalError?: string | null;
  fileErrors?: UploadErrorItem[];
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function UploadError({
  globalError,
  fileErrors = [],
  onRetry,
  onDismiss,
}: UploadErrorProps) {
  const hasGlobalError = Boolean(globalError);
  const hasFileErrors = fileErrors.length > 0;

  if (!hasGlobalError && !hasFileErrors) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3 transition-all duration-200"
    >
      {/* Error Global */}
      {hasGlobalError && (
        <div className="flex items-start gap-2">
          <span className="text-destructive mt-0.5 shrink-0 select-none" aria-hidden="true">
            ⚠
          </span>
          <p className="text-sm text-destructive font-medium break-words w-full">{globalError}</p>
        </div>
      )}

      {/* Errores Parciales por Archivo */}
      {hasFileErrors && (
        <div className="space-y-1.5">
          {!hasGlobalError && (
            <p className="text-sm font-medium text-destructive">
              {fileErrors.length} archivo{fileErrors.length > 1 ? 's' : ''} no se pudieron subir
            </p>
          )}
          <ul className="space-y-1" role="list">
            {fileErrors.map((err) => (
              <li 
                // Clave compuesta única para evitar colisiones en reintentos mutables
                key={`${err.filename}-${err.index}`} 
                className="flex items-start gap-1.5 text-xs text-destructive/80 min-w-0 w-full"
              >
                <span className="shrink-0 mt-0.5 select-none" aria-hidden="true">
                  ·
                </span>
                <span className="break-all min-w-0 w-full">
                  <span className="font-semibold text-destructive">{err.filename}</span>
                  {': '}
                  <span className="text-destructive/90 break-words">{err.reason}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Acciones de Control */}
      {(onRetry || onDismiss) && (
        <div className="flex items-center gap-4 pt-1 select-none">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-sm font-semibold text-destructive underline-offset-4 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded px-1 py-0.5 transition-shadow"
            >
              Reintentar
            </button>
          )}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-0.5 transition-shadow"
            >
              Descartar
            </button>
          )}
        </div>
      )}
    </div>
  );
}