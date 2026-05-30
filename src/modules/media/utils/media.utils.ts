import type { Media, ResourceType, FileUploadState, UploadStatus } from '../types/media.types';
import {
  ALLOWED_IMAGE_MIMETYPES,
  ALLOWED_VIDEO_MIMETYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from '../types/media.constants';

// ─── Formato de Datos ─────────────────────────────────────────────────────────

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${(bytes / 1073741824).toFixed(2)} GB`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatResolution(width?: number, height?: number): string {
  if (!width || !height) return '—';
  return `${width} × ${height}px`;
}

export function formatAspectRatio(width?: number, height?: number): string {
  if (!width || !height) return '—';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

// ─── Validaciones de MimeTypes Seguras ────────────────────────────────────────

export function isImageMimetype(mimetype: string): boolean {
  return (ALLOWED_IMAGE_MIMETYPES as readonly string[]).includes(mimetype);
}

export function isVideoMimetype(mimetype: string): boolean {
  return (ALLOWED_VIDEO_MIMETYPES as readonly string[]).includes(mimetype);
}

export function isSupportedMimetype(mimetype: string): boolean {
  return isImageMimetype(mimetype) || isVideoMimetype(mimetype);
}

export function getResourceTypeFromMime(mimetype: string): ResourceType | null {
  if (isImageMimetype(mimetype)) return 'image';
  if (isVideoMimetype(mimetype)) return 'video';
  return null;
}

export function getResourceTypeFromUrl(url: string): ResourceType {
  return url.includes('/video/') ? 'video' : 'image';
}

// ─── Validaciones Unitarias y por Lotes ───────────────────────────────────────

export interface FileValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateFileType(file: File): FileValidationResult {
  if (!file.type) {
    return { valid: false, reason: 'No se pudo detectar el tipo de archivo' };
  }
  if (!isSupportedMimetype(file.type)) {
    return { valid: false, reason: `Tipo no soportado: ${file.type}` };
  }
  return { valid: true };
}

export function validateFileSize(file: File): FileValidationResult {
  const maxSize = isImageMimetype(file.type) ? MAX_IMAGE_SIZE_BYTES : MAX_VIDEO_SIZE_BYTES;

  if (file.size > maxSize) {
    return {
      valid: false,
      reason: `Supera el límite permitido de ${formatBytes(maxSize)}`,
    };
  }
  return { valid: true };
}

export function validateFile(file: File): FileValidationResult {
  const typeResult = validateFileType(file);
  if (!typeResult.valid) return typeResult;
  return validateFileSize(file);
}

export function validateFileBatch(
  files: File[],
  maxFiles: number
): { valid: File[]; errors: string[] } {
  const errors: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Máximo ${maxFiles} archivos por subida (recibidos: ${files.length})`);
    return { valid: [], errors };
  }

  const valid: File[] = [];

  for (const file of files) {
    const result = validateFile(file);
    if (result.valid) {
      valid.push(file);
    } else {
      errors.push(`"${file.name}": ${result.reason}`);
    }
  }

  return { valid, errors };
}

// ─── Control de Object URLs (Previews) ────────────────────────────────────────

export function createPreviewUrl(file: File): string | undefined {
  if (isSupportedMimetype(file.type)) {
    return URL.createObjectURL(file);
  }
  return undefined;
}

export function revokePreviewUrl(url?: string): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function revokeAllPreviewUrls(fileStates: FileUploadState[]): void {
  fileStates.forEach((s) => revokePreviewUrl(s.previewUrl));
}

// ─── Cálculos de Progreso y Estados ──────────────────────────────────────────

export function isTerminalStatus(status: UploadStatus): boolean {
  return status === 'success' || status === 'error';
}

export function isActiveStatus(status: UploadStatus): boolean {
  return status === 'uploading';
}

export function getUploadSummary(fileStates: FileUploadState[]): {
  total: number;
  uploaded: number;
  failed: number;
  pending: number;
  progress: number;
} {
  const total = fileStates.length;
  if (total === 0) {
    return { total: 0, uploaded: 0, failed: 0, pending: 0, progress: 0 };
  }

  const uploaded = fileStates.filter((s) => s.status === 'success').length;
  const failed = fileStates.filter((s) => s.status === 'error').length;
  const pending = fileStates.filter((s) => s.status === 'idle' || s.status === 'uploading').length;
  
  // CORREGIDO: Cálculo seguro y redondeado sin peligro de desbordamiento flotante
  const sumProgress = fileStates.reduce((acc, s) => acc + s.progress, 0);
  const progress = Math.min(100, Math.max(0, Math.round(sumProgress / total)));

  return { total, uploaded, failed, pending, progress };
}

// ─── Mutaciones y Filtros sobre Entidades Media ───────────────────────────────

export function isMediaImage(media: Media): boolean {
  return media.resourceType === 'image';
}

export function isMediaVideo(media: Media): boolean {
  return media.resourceType === 'video';
}

export function sortMedia(media: Media[]): Media[] {
  return [...media].sort((a, b) => {
    if (a.resourceType !== b.resourceType) {
      return a.resourceType === 'image' ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function partitionMedia(media: Media[]): { images: Media[]; videos: Media[] } {
  return media.reduce(
    (acc, item) => {
      if (item.resourceType === 'image') acc.images.push(item);
      else acc.videos.push(item);
      return acc;
    },
    { images: [] as Media[], videos: [] as Media[] }
  );
}

export function getTotalSize(media: Media[]): string {
  const bytes = media.reduce((acc, m) => acc + m.bytes, 0);
  return formatBytes(bytes);
}

export function getPrimaryImage(media: Media[]): Media | undefined {
  return media.find((m) => m.resourceType === 'image');
}

export function deduplicateMedia(media: Media[]): Media[] {
  const seen = new Set<string>();
  return media.filter((m) => {
    if (seen.has(m._id)) return false;
    seen.add(m._id);
    return true;
  });
}