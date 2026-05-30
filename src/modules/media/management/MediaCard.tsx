'use client';

import Image from 'next/image';
import { FaPlay, FaCheck, FaTrashAlt } from 'react-icons/fa';
import type { MediaCardProps } from '../types/media.types';
import { formatBytes } from '../utils/media.utils';
import { buildCloudinaryUrl, buildVideoThumbnailUrl } from '../utils/cloudinary.utils';

export function MediaCard({
  media,
  selectable = false,
  selected = false,
  onSelect,
  onDelete,
}: MediaCardProps) {
  const isVideo = media.resourceType === 'video';

  const handleSelect = () => {
    if (selectable) onSelect?.(media);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(media);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  const optimizedImageSrc = buildCloudinaryUrl(media.secureUrl, 'image', {
    width: 400,
    height: 400,
    crop: 'fill',
    gravity: 'auto',
  });

  const optimizedVideoPoster = buildVideoThumbnailUrl(media.secureUrl, {
    width: 400,
    height: 400,
  });

  return (
    <div
      role={selectable ? 'checkbox' : 'article'}
      aria-checked={selectable ? selected : undefined}
      aria-label={media.publicId}
      tabIndex={selectable ? 0 : undefined}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      data-selected={selected}
      className={[
        'group relative rounded-lg overflow-hidden border bg-muted flex flex-col',
        'transition-all duration-200 outline-none',
        selectable
          ? 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          : '',
        selected
          ? 'ring-2 ring-primary border-primary'
          : 'border-border hover:border-border/80',
      ].join(' ')}
    >
      {/* ── Thumbnail ─────────────────────────────────────────────────── */}
      <div className="relative aspect-square w-full bg-muted overflow-hidden select-none">
        <Image
          src={isVideo ? optimizedVideoPoster : optimizedImageSrc}
          alt={media.publicId}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
          unoptimized
          quality={20}
        />

        {/* Ícono de Play superpuesto exclusivo para videos */}
        {isVideo && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10"
            aria-hidden="true"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
              <FaPlay className="text-white text-xs ml-0.5" />
            </div>
          </div>
        )}

        {/* Overlay hover utilizando color de marca */}
        <div
          className={[
            'absolute inset-0 bg-primary/0 group-hover:bg-primary/10 z-10',
            'transition-colors duration-200',
            selected ? 'bg-primary/5' : '',
          ].join(' ')}
          aria-hidden="true"
        />

        {/* Badge de tipo */}
        {isVideo && (
          <span
            className="absolute top-2 left-2 z-20 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white"
            aria-hidden="true"
          >
            VIDEO
          </span>
        )}

        {/* Checkmark selección */}
        {selectable && (
          <div
            className={[
              'absolute top-2 right-2 flex items-center justify-center z-20',
              'w-5 h-5 rounded-full border transition-all duration-150',
              selected
                ? 'bg-primary border-primary scale-110'
                : 'bg-background/80 border-border opacity-0 group-hover:opacity-100',
            ].join(' ')}
            aria-hidden="true"
          >
            {selected && <FaCheck className="text-primary-foreground text-[10px]" />}
          </div>
        )}

        {/* Botón eliminar */}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Eliminar archivo ${media.publicId}`}
            className={[
              'absolute bottom-2 right-2 z-20',
              'flex items-center justify-center w-7 h-7 rounded-full',
              'bg-black/60 text-white outline-none',
              'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
              'hover:bg-destructive hover:text-white transition-all duration-150',
              'focus-visible:ring-2 focus-visible:ring-destructive',
            ].join(' ')}
          >
            <FaTrashAlt className="text-[11px]" />
          </button>
        )}
      </div>

      {/* ── Footer metadata ───────────────────────────────────────────── */}
      <div className="px-2 py-1.5 space-y-0.5 bg-background flex-1 flex flex-col justify-between">
        <div>
          <p
            className="text-xs text-foreground font-medium truncate"
            title={media.publicId}
          >
            {media.publicId.split('/').pop()}
          </p>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
            <span className="font-semibold">{media.format.toUpperCase()}</span>
            <span className="tabular-nums">{formatBytes(media.bytes)}</span>
          </div>
        </div>
        {media.width && media.height && (
          <p className="text-[10px] text-muted-foreground/80 pt-0.5 border-t border-border/40 mt-1">
            {media.width} × {media.height}px
          </p>
        )}
      </div>
    </div>
  );
}