import { z } from 'zod';
import {
    MediaFolderSchema,
    ResourceTypeSchema,
    MediaSchema,
    UploadResponseSchema,
    UploadErrorItemSchema,
    MediaListResponseSchema,
    MediaListParamsSchema,
    UploadMediaParamsSchema,
    DeleteMediaResponseSchema,
} from './media.schemas';

export type MediaFolder = z.infer<typeof MediaFolderSchema>;
export type ResourceType = z.infer<typeof ResourceTypeSchema>;

export type Media = z.infer<typeof MediaSchema>;
export type UploadErrorItem = z.infer<typeof UploadErrorItemSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type DeleteMediaResponse = z.infer<typeof DeleteMediaResponseSchema>;

export type MediaListParams = z.infer<typeof MediaListParamsSchema>;
export type UploadMediaParams = z.infer<typeof UploadMediaParamsSchema>;
export type MediaListResponse = z.infer<typeof MediaListResponseSchema>;

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileUploadState {
    file: File;
    status: UploadStatus;
    progress: number;
    result?: Media;
    error?: string;
    previewUrl?: string;
}

export interface MediaUploaderBaseProps {
    folder: MediaFolder;
    accept: 'image' | 'video' | 'both';
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
    aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'free';
    onSuccess: (media: Media[]) => void;
    onError?: (errors: UploadErrorItem[]) => void;
}

export interface MediaPickerProps {
    folder: MediaFolder;
    multiple?: boolean;
    maxSelectable?: number;
    open: boolean;
    onClose: () => void;
    onConfirm: (selected: Media[]) => void;
}

export interface MediaCardProps {
    media: Media;
    selectable?: boolean;
    selected?: boolean;
    onSelect?: (media: Media) => void;
    onDelete?: (media: Media) => void;
}

export interface CloudinaryTransformOptions {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'webp' | 'avif' | 'auto';
    crop?: 'fill' | 'fit' | 'crop' | 'scale' | 'thumb';
    gravity?: 'auto' | 'face' | 'center';
}