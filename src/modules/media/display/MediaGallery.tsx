
'use client';

import { useState, useCallback, useEffect, useId } from 'react';
import { MediaImage } from './MediaImage';
import { MediaVideo } from './MediaVideo';
import type { Media } from '../types/media.types';

interface MediaGalleryProps {
  media: Media[];
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: '1:1' | '4:3' | '16:9';
  lightbox?: boolean;
  maxVisible?: number;
  className?: string;
}

const COLUMNS_CLASS: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
};

const GAP_CLASS: Record<string, string> = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

const ASPECT_CLASS: Record<string, string> = {
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
};

export function MediaGallery({
  media,
  columns = 3,
  gap = 'md',
  aspectRatio = '1:1',
  lightbox = true,
  maxVisible,
  className = '',
}: MediaGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryId = useId();

  const visibleMedia = maxVisible ? media.slice(0, maxVisible) : media;
  const hiddenCount = maxVisible ? Math.max(0, media.length - maxVisible) : 0;
  const aspectClass = ASPECT_CLASS[aspectRatio];

  const openLightbox = useCallback((index: number) => {
    if (lightbox) setLightboxIndex(index);
  }, [lightbox]);

  const closeLightbox = useCallback(() => {
    // Recuperamos el foco en el elemento que abrió el lightbox originalmente
    const triggerElement = document.getElementById(`${galleryId}-trigger-${lightboxIndex}`);
    setLightboxIndex(null);
    setTimeout(() => triggerElement?.focus(), 0);
  }, [galleryId, lightboxIndex]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % media.length));
  }, [media.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + media.length) % media.length));
  }, [media.length]);

  if (media.length === 0) return null;

  return (
    <>
      {/* ── Grid ──────────────────────────────────────────────────────── */}
      <ul
        role="list"
        className={`grid ${COLUMNS_CLASS[columns]} ${GAP_CLASS[gap]} ${className}`}
        aria-label="Galería de medios"
      >
        {visibleMedia.map((item, index) => (
          <li key={item._id}>
            <button
              id={`${galleryId}-trigger-${index}`}
              type="button"
              onClick={() => openLightbox(index)}
              disabled={!lightbox}
              aria-label={`Ver ${item.resourceType === 'video' ? 'video' : 'imagen'} ${index + 1}`}
              className={[
                `relative w-full overflow-hidden rounded-md ${aspectClass}`,
                'block bg-muted',
                lightbox
                  ? 'cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  : 'cursor-default',
              ].join(' ')}
            >
              {item.resourceType === 'video' ? (
                <MediaVideo
                  src={item.secureUrl}
                  aspectRatio={aspectRatio === '1:1' ? '1:1' : aspectRatio === '4:3' ? '4:3' : '16:9'}
                  controls={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <MediaImage
                  src={item.secureUrl}
                  alt={item.publicId}
                  fill
                  transforms={{ width: 400, crop: 'fill', gravity: 'auto' }}
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="absolute inset-0"
                />
              )}
            </button>
          </li>
        ))}

        {/* ── Tile "+N más" ─────────────────────────────────────────── */}
        {hiddenCount > 0 && (
          <li>
            <button
              id={`${galleryId}-trigger-${maxVisible}`}
              type="button"
              onClick={() => openLightbox(maxVisible!)}
              aria-label={`Ver ${hiddenCount} archivos más`}
              className={`relative w-full overflow-hidden rounded-md ${aspectClass} bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
            >
              {media[maxVisible!] && (
                <MediaImage
                  src={media[maxVisible!].secureUrl}
                  alt=""
                  fill
                  transforms={{ width: 400 }}
                  className="absolute inset-0 opacity-40"
                />
              )}
              <span className="relative z-10 text-xl font-semibold text-foreground">
                +{hiddenCount}
              </span>
            </button>
          </li>
        )}
      </ul>

      {/* ── Lightbox Modal Corregido ──────────────────────────────────── */}
      {lightbox && lightboxIndex !== null && (
        <Lightbox
          media={media}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  );
}

// ─── Lightbox Component Confinado ─────────────────────────────────────────────

interface LightboxProps {
  media: Media[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function Lightbox({ media, currentIndex, onClose, onNext, onPrev }: LightboxProps) {
  const current = media[currentIndex];
  const hasMultiple = media.length > 1;

  // Bloqueo estricto de Scroll de Fondo
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Escucha de eventos de teclado desacoplada en el modal
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (hasMultiple) {
        if (e.key === 'ArrowRight') onNext();
        if (e.key === 'ArrowLeft') onPrev();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, onNext, onPrev, hasMultiple]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada de galería"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor Principal */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-h-[80vh] flex items-center justify-center">
          {current.resourceType === 'video' ? (
            <MediaVideo
              src={current.secureUrl}
              aspectRatio="16:9"
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-md shadow-2xl"
            />
          ) : (
            <MediaImage
              src={current.secureUrl}
              alt={current.publicId}
              fill={false}
              width={current.width ?? 1280}
              height={current.height ?? 720}
              transforms={{ quality: 'auto', format: 'auto' }}
              sizes="90vw"
              priority
              className="max-h-[80vh] w-auto rounded-md object-contain shadow-2xl"
            />
          )}
        </div>

        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar vista ampliada"
          className="absolute -top-12 right-4 md:right-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          ✕
        </button>

        {/* Botones de Navegación Lateral */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Archivo anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Archivo siguiente"
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              ›
            </button>

            {/* Contador de Posición */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm text-white tabular-nums">
              {currentIndex + 1} / {media.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}