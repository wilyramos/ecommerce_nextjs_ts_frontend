import type { CloudinaryTransformOptions } from '../types/media.types';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!CLOUD_NAME) {
  throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME no está definida en las variables de entorno');
}

/**
 * Construye una URL de Cloudinary con transformaciones unificadas en un solo segmento.
 * Soporta tanto public_id como secure_url de forma indistinta.
 */
export function buildCloudinaryUrl(
  source: string,
  resourceType: 'image' | 'video' = 'image',
  options: CloudinaryTransformOptions = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
  } = options;

  const publicId = source.startsWith('http')
    ? extractPublicIdFromUrl(source)
    : source;

  const transforms: string[] = [];

  // CORREGIDO: Ancho, alto, recorte y gravedad van juntos en el mismo segmento de la URL
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) {
    transforms.push(`c_${crop}`);
    transforms.push(`g_${gravity}`);
  }
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  const transformStr = transforms.length > 0 ? transforms.join(',') + '/' : '';

  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${transformStr}${publicId}`;
}

/**
 * Extrae de forma segura el public_id desde una URL de Cloudinary.
 */
export function extractPublicIdFromUrl(url: string): string {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
  if (!match) throw new Error(`URL de Cloudinary inválida: ${url}`);
  return match[1];
}

/**
 * Genera srcSet optimizado para imágenes responsivas.
 */
export function buildSrcSet(
  source: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map((w) => `${buildCloudinaryUrl(source, 'image', { width: w })} ${w}w`)
    .join(', ');
}

/**
 * Genera una URL en miniatura comprimida para actuar como blurDataURL en next/image.
 */
export function buildBlurUrl(source: string): string {
  return buildCloudinaryUrl(source, 'image', {
    width: 10,
    quality: 30,
    format: 'webp',
    crop: 'fill',
  });
}

/**
 * URL de thumbnail optimizada para videos (Captura fija del segundo 0).
 */
export function buildVideoThumbnailUrl(
  source: string,
  options: Pick<CloudinaryTransformOptions, 'width' | 'height'> = {}
): string {
  const publicId = source.startsWith('http')
    ? extractPublicIdFromUrl(source)
    : source;

  const { width = 640, height = 360 } = options;

  // so_0 = Start Offset 0 segundos del stream
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${width},h_${height},c_fill,so_0,f_webp/${publicId}`;
}