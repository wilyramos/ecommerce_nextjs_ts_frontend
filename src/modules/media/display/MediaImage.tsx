'use client';

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { ImageOff, ImageIcon } from 'lucide-react';
import { buildCloudinaryUrl, buildBlurUrl } from '../utils/cloudinary.utils';
import type { CloudinaryTransformOptions } from '../types/media.types';

interface MediaImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  transforms?: CloudinaryTransformOptions;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function MediaImage({
  src,
  alt,
  fill = false,
  width,
  height,
  transforms = {},
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  className = '',
  fallback,
  onLoad,
  onError,
}: MediaImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reiniciamos los estados reactivos si la ruta base del archivo cambia
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Serializamos las llaves del objeto transforms para evitar re-cálculos por referencias de objetos literales ({})
  const serializedTransforms = JSON.stringify(transforms);

  const optimizedSrc = useMemo(() => {
    return buildCloudinaryUrl(src, 'image', {
      quality: 'auto',
      format: 'auto',
      ...transforms,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, serializedTransforms]);

  const blurDataURL = useMemo(() => buildBlurUrl(src), [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    if (fallback) return <>{fallback}</>;

    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground border border-border/40 rounded-lg ${className}`}
        role="img"
        aria-label={alt}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <ImageOff className="h-5 w-5 opacity-60" aria-hidden="true" />
      </div>
    );
  }

  if (!fill && (!width || !height)) {
    console.warn('[MediaImage] Se requiere width y height cuando fill=false');
    return null;
  }

  const containerClasses = `relative overflow-hidden ${fill ? 'w-full h-full' : 'inline-block'} ${className}`;
  const imageClasses = `transition-all duration-300 ease-in-out ${fill ? 'object-cover' : ''} ${
    isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-sm'
  }`;

  return (
    <div className={containerClasses} style={!fill ? { width, height } : undefined}>
      {!isLoaded && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-muted animate-pulse"
          aria-hidden="true"
        >
          <ImageIcon className="h-5 w-5 text-muted-foreground/40 animate-bounce" />
        </div>
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}