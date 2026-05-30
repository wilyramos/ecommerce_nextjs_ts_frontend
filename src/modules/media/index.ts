// ─── Components — Uploaders ───────────────────────────────────────────────────
export { MediaUploader } from './uploaders/MediaUploader';

// ─── Components — Display ────────────────────────────────────────────────────
export { MediaImage } from './display/MediaImage';
export { MediaVideo } from './display/MediaVideo';
export { MediaGallery } from './display/MediaGallery';

// ─── Components — Management ─────────────────────────────────────────────────
export { MediaCard } from './management/MediaCard';
export { MediaGrid } from './management/MediaGrid';
export { MediaPicker } from './management/MediaPicker';
export { MediaDeleteButton } from './management/MediaDeleteButton';

// ─── Components — Feedback ───────────────────────────────────────────────────
export { UploadDropzone } from './feedback/UploadDropzone';
export { UploadProgress } from './feedback/UploadProgress';
export { UploadError } from './feedback/UploadError';

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useUploadMedia } from './hooks/useUploadMedia';
export { useDeleteMedia } from './hooks/useDeleteMedia';
export { useMediaList } from './hooks/useMediaList';
export { useMediaPicker } from './hooks/useMediaPicker';

// ─── Service ─────────────────────────────────────────────────────────────────
export { MediaService } from './services/media.service';

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  Media,
  MediaFolder,
  ResourceType,
  UploadResponse,
  UploadErrorItem,
  MediaListParams,
  MediaListResponse,
  UploadMediaParams,
  DeleteMediaResponse,
  UploadStatus,
  FileUploadState,
  MediaUploaderBaseProps,
  MediaPickerProps,
  MediaCardProps,
  CloudinaryTransformOptions,
} from './types/media.types';

// ─── Schemas (Validación Zod para formularios o integraciones externas) ──────
export {
  MediaSchema,
  MediaFolderSchema,
  ResourceTypeSchema,
  UploadResponseSchema,
  MediaListResponseSchema,
  SingleFileSchema,
  UploadMediaParamsSchema,
} from './types/media.schemas';

// ─── Utils — Media Helpers ───────────────────────────────────────────────────
export {
  formatBytes,
  formatDuration,
  formatResolution,
  formatAspectRatio,
  isImageMimetype,
  isVideoMimetype,
  isSupportedMimetype,
  getResourceTypeFromMime,
  getResourceTypeFromUrl,
  validateFile,
  validateFileBatch,
  createPreviewUrl,
  revokePreviewUrl,
  revokeAllPreviewUrls,
  getUploadSummary,
  isTerminalStatus,
  isActiveStatus,
  isMediaImage,
  isMediaVideo,
  sortMedia,
  partitionMedia,
  getTotalSize,
  getPrimaryImage,
  deduplicateMedia,
} from './utils/media.utils';

// ─── Utils — Cloudinary Engine ───────────────────────────────────────────────
export {
  buildCloudinaryUrl,
  buildSrcSet,
  buildBlurUrl,
  buildVideoThumbnailUrl,
  extractPublicIdFromUrl,
} from './utils/cloudinary.utils';

// ─── Constants (Fuente de Verdad Única) ──────────────────────────────────────
export {
  ALLOWED_FOLDERS_LIST,
  ALLOWED_RESOURCE_TYPES_LIST,
  ALLOWED_IMAGE_MIMETYPES,
  ALLOWED_VIDEO_MIMETYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  MAX_FILES_PER_REQUEST,
  ACCEPT_MAP,
  FOLDER_LABELS,
  SIZE_LABELS,
} from './types/media.constants';