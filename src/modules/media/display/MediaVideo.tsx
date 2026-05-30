'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { buildVideoThumbnailUrl } from '../utils/cloudinary.utils';

interface MediaVideoProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const ASPECT_CLASS: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16]',
};

export function MediaVideo({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  width,
  height,
  className = '',
  aspectRatio = '16:9',
  onPlay,
  onPause,
  onEnded,
}: MediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reiniciamos los estados si el archivo de origen cambia de forma dinámica
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    setIsPlaying(false);
    setShowThumbnail(!autoPlay);
  }, [src, autoPlay]);

  const thumbnailUrl = poster ?? buildVideoThumbnailUrl(src, { width: width ?? 1280 });

  // ── Handlers de Control Estricto ──────────────────────────────────────────

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setShowThumbnail(false);
    onPlay?.();
  }, [onPlay]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    onPause?.();
  }, [onPause]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (!loop) {
      setShowThumbnail(true);
    }
    onEnded?.();
  }, [loop, onEnded]);

  const handleThumbnailClick = useCallback(() => {
    if (!videoRef.current) return;
    setShowThumbnail(false);
    
    // Ejecutamos la reproducción controlando la promesa nativa para evitar excepciones de Autoplay
    videoRef.current.play().catch((err) => {
      console.warn('[MediaVideo] La reproducción fue bloqueada por políticas del navegador:', err);
    });
  }, []);

  const aspectClass = ASPECT_CLASS[aspectRatio] ?? 'aspect-video';

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${aspectClass} ${className}`}
        role="img"
        aria-label="Video no disponible"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-3xl" aria-hidden="true">🎬</span>
          <p className="text-xs">Video no disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-primary ${aspectClass} ${className}`}
      style={width && height ? { width, height } : undefined}
    >
      {/* ── Capa de Poster (Thumbnail) ── */}
      {showThumbnail && (
        <button
          type="button"
          onClick={handleThumbnailClick}
          aria-label="Reproducir video"
          className="absolute inset-0 z-20 w-full h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src={thumbnailUrl}
            alt="Vista previa del video"
            fill
            className="object-cover"
            unoptimized
          />
          <div
            className="absolute inset-0 bg-primary/30 group-hover:bg-primary/40 transition-colors"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 group-hover:scale-110 transition-transform duration-200">
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="currentColor"
                className="ml-1 text-primary-foreground"
              >
                <path d="M0 0L20 11L0 22V0Z" />
              </svg>
            </div>
          </div>
        </button>
      )}

      {/* ── Skeleton de Carga ── */}
      {!isLoaded && !showThumbnail && (
        <div
          className="absolute inset-0 z-10 bg-primary animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* ── Elemento Nativo Persistente ── */}
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        // Forzamos silenciamiento nativo si autoPlay viene activo para cumplir con las políticas del navegador
        muted={autoPlay ? true : muted}
        controls={controls && !showThumbnail}
        playsInline
        className={[
          'w-full h-full object-contain transition-opacity duration-300',
          isLoaded && !showThumbnail ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onCanPlay={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />

      {/* ── Badge de Estado ── */}
      {isPlaying && !controls && (
        <div
          className="absolute top-2 right-2 z-10 rounded-md bg-primary/60 px-2 py-0.5 text-[10px] text-primary-foreground"
          aria-live="polite"
        >
          ▶ Reproduciendo
        </div>
      )}
    </div>
  );
}