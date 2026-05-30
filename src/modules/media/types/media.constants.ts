export const ALLOWED_FOLDERS_LIST = [
  'products',
  'banners',
  'brands',
  'avatars',
  'collections',
  'general',
] as const;

export const ALLOWED_RESOURCE_TYPES_LIST = ['image', 'video'] as const;

export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
export const MAX_FILES_PER_REQUEST = 10;

export const ALLOWED_IMAGE_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
] as const;

export const ALLOWED_VIDEO_MIMETYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
] as const;

export const ACCEPT_IMAGE = ALLOWED_IMAGE_MIMETYPES.join(',');
export const ACCEPT_VIDEO = ALLOWED_VIDEO_MIMETYPES.join(',');
export const ACCEPT_BOTH = [...ALLOWED_IMAGE_MIMETYPES, ...ALLOWED_VIDEO_MIMETYPES].join(',');

export const ACCEPT_MAP = {
  image: ACCEPT_IMAGE,
  video: ACCEPT_VIDEO,
  both: ACCEPT_BOTH,
} as const;

export const FOLDER_LABELS: Record<typeof ALLOWED_FOLDERS_LIST[number], string> = {
  products: 'Productos',
  banners: 'Banners',
  brands: 'Marcas',
  avatars: 'Avatares',
  collections: 'Colecciones',
  general: 'General',
};

export const SIZE_LABELS = {
  image: '15 MB',
  video: '100 MB',
} as const;