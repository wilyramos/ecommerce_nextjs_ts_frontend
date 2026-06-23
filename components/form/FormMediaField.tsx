'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaTimes, FaFilm, FaPlus, FaCloudUploadAlt, FaRegImage, FaGripVertical } from 'react-icons/fa';
import { UploadDropzone } from '@/src/modules/media/feedback/UploadDropzone';
import { UploadProgress } from '@/src/modules/media/feedback/UploadProgress';
import { UploadError } from '@/src/modules/media/feedback/UploadError';
import { useUploadMedia } from '@/src/modules/media/hooks/useUploadMedia';
import type { MediaFolder } from '@/src/modules/media/types/media.types';
import { buildCloudinaryUrl, buildVideoThumbnailUrl } from '@/src/modules/media/utils/cloudinary.utils';

// Shadcn UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Core Media Components & Hooks
import { MediaGrid } from '@/src/modules/media/management/MediaGrid';
import { useMediaPicker } from '@/src/modules/media/hooks/useMediaPicker';
import { useMediaList } from '@/src/modules/media/hooks/useMediaList';

interface FormMediaFieldProps {
    name: string;
    folder: MediaFolder;
    label?: string;
    defaultValue?: string | string[];
    multiple?: boolean;
    maxFiles?: number;
    accept?: 'image' | 'video' | 'both';
    onChange?: (urls: string[]) => void;
}

export function FormMediaField({
    name,
    folder,
    label,
    defaultValue = '',
    multiple = false,
    maxFiles = 10,
    accept = 'image',
    onChange,
}: FormMediaFieldProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (Array.isArray(defaultValue)) {
            setSelectedUrls(defaultValue.filter(Boolean));
        } else if (typeof defaultValue === 'string' && defaultValue.trim() !== '') {
            setSelectedUrls([defaultValue]);
        }
    }, [defaultValue]);

    const triggerChange = (urls: string[]) => {
        setSelectedUrls(urls);
        if (onChange) {
            onChange(urls);
        }
    };

    // Manejadores para Drag & Drop
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const newUrls = [...selectedUrls];
        const draggedUrl = newUrls[draggedIndex];
        
        // Remover del índice original
        newUrls.splice(draggedIndex, 1);
        // Insertar en el nuevo índice
        newUrls.splice(targetIndex, 0, draggedUrl);
        
        setDraggedIndex(null);
        triggerChange(newUrls);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const uploader = useUploadMedia({
        folder,
        accept,
        multiple,
        maxFiles,
        onSuccess: (uploadedMedia) => {
            const urls = uploadedMedia.map((m) => m.secureUrl);
            const nextUrls = multiple ? [...selectedUrls, ...urls] : [urls[0]];
            triggerChange(nextUrls);
            uploader.reset();
            setIsModalOpen(false);
        },
    });

    const picker = useMediaPicker({
        multiple,
        maxSelectable: maxFiles,
        onConfirm: (mediaArray) => {
            const urls = mediaArray.map((m) => m.secureUrl);
            const nextUrls = multiple ? [...selectedUrls, ...urls] : [urls[0]];
            triggerChange(nextUrls);
            setIsModalOpen(false);
        },
        onClose: () => setIsModalOpen(false),
    });

    const list = useMediaList({
        folder,
        limit: 24,
        autoFetch: isModalOpen && activeTab === 'library',
    });

    const pickerOpen = picker.open;
    const pickerClose = picker.close;

    useEffect(() => {
        if (isModalOpen && activeTab === 'library') {
            pickerOpen(folder);
        }
    }, [isModalOpen, activeTab, folder, pickerOpen]);

    const handleCloseModal = useCallback(() => {
        pickerClose();
        uploader.reset();
        setIsModalOpen(false);
    }, [pickerClose, uploader]);

    const handleRemoveUrl = useCallback((urlToRemove: string) => {
        const nextUrls = selectedUrls.filter((url) => url !== urlToRemove);
        setSelectedUrls(nextUrls);
        if (onChange) {
            onChange(nextUrls);
        }
    }, [selectedUrls, onChange]);

    const renderThumbnail = (url: string, index: number) => {
        if (!url) return null;

        const isVideo = url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.webm');
        const thumbSrc = isVideo
            ? buildVideoThumbnailUrl(url, { width: 200, height: 200 })
            : buildCloudinaryUrl(url, 'image', { width: 200, height: 200, crop: 'fill' });

        const isDragging = draggedIndex === index;

        return (
            <div
                key={url}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative aspect-square rounded-lg border border-[color:var(--color-border)] overflow-hidden group select-none cursor-grab active:cursor-grabbing transition-all ${
                    isDragging ? 'opacity-50 scale-95 ring-2 ring-[color:var(--color-action-cta)]' : ''
                }`}
            >
                {/* Badge de Orden */}
                <div className="absolute top-1 left-1 z-30 flex items-center justify-center w-6 h-6 rounded-full bg-[color:var(--color-action-cta)] text-white text-xs font-bold">
                    {index + 1}
                </div>

                {/* Icono de Drag */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors z-20 opacity-0 group-hover:opacity-100">
                    <FaGripVertical className="w-5 h-5 text-white drop-shadow-md" />
                </div>

                <Image
                    src={thumbSrc}
                    alt="Vista previa de archivo"
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
                    className="object-cover transition-transform group-hover:scale-105"
                    priority={index === 0}
                    unoptimized
                    quality={isVideo ? 20 : 25}
                />
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--color-foreground)]/20 z-10">
                        <FaFilm className="w-5 h-5 text-[color:var(--color-background)] drop-shadow-md" />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => handleRemoveUrl(url)}
                    className="absolute bottom-1.5 right-1.5 z-20 flex items-center justify-center w-5 h-5 rounded-full bg-[color:var(--color-foreground)]/70 text-[color:var(--color-background)] hover:bg-[color:var(--color-destructive)] transition-colors outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]"
                >
                    <FaTimes className="text-[10px]" />
                </button>
                <input
                    type="hidden"
                    name={multiple ? `${name}[]` : name}
                    value={url}
                />
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {label && <Label className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">{label}</Label>}

            {selectedUrls.length > 0 && (
                <p className="text-xs text-[color:var(--color-muted-foreground)] italic">
                    Arrastra las imágenes para reordenarlas • La imagen 1 será la portada
                </p>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {selectedUrls.map((url, index) => renderThumbnail(url, index))}

                {(multiple || selectedUrls.length === 0) && (selectedUrls.length < maxFiles) && (
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('upload');
                            setIsModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-[color:var(--color-border)] hover:border-[color:var(--color-border-hover)] text-[color:var(--color-muted-foreground)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] cursor-pointer"
                    >
                        <FaPlus className="text-lg mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Añadir</span>
                    </button>
                )}
            </div>

            {selectedUrls.length === 0 && <input type="hidden" name={name} value="" />}

            <Dialog open={isModalOpen} onOpenChange={(openState) => { if (!openState) handleCloseModal(); else setIsModalOpen(true); }}>
                <DialogContent className="max-w-4xl w-full h-[85vh] flex flex-col p-0 overflow-hidden border-[color:var(--color-border)]">
                    <DialogHeader className="px-6 pt-5 pb-2 border-b border-[color:var(--color-border)] shrink-0 text-left">
                        <DialogTitle className="text-[color:var(--color-foreground)]">
                            Gestionar Recursos Multimedia
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs
                        value={activeTab}
                        onValueChange={(val) => setActiveTab(val as 'upload' | 'library')}
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <div className="px-6 py-2 border-b border-[color:var(--color-border)] shrink-0">
                            <TabsList className="grid w-full max-w-[400px] grid-cols-2 h-9 bg-[color:var(--color-border)] p-1">
                                <TabsTrigger value="upload" className="text-xs font-medium data-[state=active]:text-[color:var(--color-foreground)] text-[color:var(--color-muted-foreground)]">Subir Archivos</TabsTrigger>
                                <TabsTrigger value="library" className="text-xs font-medium data-[state=active]:text-[color:var(--color-foreground)] text-[color:var(--color-muted-foreground)]">Biblioteca de Medios</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="upload" className="flex-1 overflow-y-auto p-6 focus-visible:outline-none m-0 space-y-4">
                            <UploadDropzone
                                accept={accept}
                                multiple={multiple}
                                maxFiles={maxFiles - selectedUrls.length}
                                isUploading={uploader.isUploading}
                                onFiles={uploader.upload}
                            >
                                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                                    <FaCloudUploadAlt className="w-8 h-8 text-[color:var(--color-muted-foreground)]" />
                                    <p className="text-xs font-semibold text-[color:var(--color-foreground)]">Arrastra tus archivos aquí o haz clic para examinar</p>
                                    <p className="text-[10px] text-[color:var(--color-muted-foreground)] font-medium">
                                        Máximo {maxFiles - selectedUrls.length} archivo(s) restante(s)
                                    </p>
                                </div>
                            </UploadDropzone>

                            <UploadProgress
                                fileStates={uploader.fileStates}
                                globalProgress={uploader.globalProgress}
                                uploadedCount={uploader.uploadedCount}
                                failedCount={uploader.failedCount}
                                totalCount={uploader.fileStates.length}
                            />

                            <UploadError
                                fileErrors={uploader.fileStates.filter((s) => s.status === 'error').map((s, i) => ({ index: i, filename: s.file.name, reason: s.error || '' }))}
                                onRetry={uploader.retryFailed}
                                onDismiss={uploader.reset}
                            />
                        </TabsContent>

                        <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col focus-visible:outline-none m-0">
                            {multiple && (
                                <div className="flex items-center justify-between px-6 py-2 border-b border-[color:var(--color-border)] text-[color:var(--color-muted-foreground)] select-none shrink-0">
                                    <span className="text-xs font-medium">
                                        {picker.selectionCount > 0
                                            ? `${picker.selectionCount} seleccionado${picker.selectionCount > 1 ? 's' : ''}`
                                            : 'Ninguno seleccionado'}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        {picker.selectionCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={picker.clearSelection}
                                                disabled={list.media.length === 0}
                                                className="text-xs font-semibold text-[color:var(--color-muted-foreground)] hover:text-[color:var(--color-foreground)] outline-none disabled:opacity-40"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => picker.selectAll(list.media)}
                                            disabled={list.media.length === 0}
                                            className="text-xs font-semibold text-[color:var(--color-action-cta)] hover:text-[color:var(--color-action-cta-hover)] outline-none disabled:opacity-40"
                                        >
                                            Seleccionar todo
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex-1 overflow-y-auto p-6">
                                <MediaGrid
                                    media={list.media}
                                    isLoading={list.isLoading}
                                    isFetchingMore={list.isFetchingMore}
                                    hasMore={list.hasMore}
                                    error={list.error}
                                    selectable={true}
                                    selectedIds={picker.selectedIds}
                                    canSelectMore={picker.canSelectMore}
                                    onSelect={picker.toggleSelect}
                                    onLoadMore={list.fetchNextPage}
                                    columns={4}
                                    emptyMessage={`No se encontraron archivos en la carpeta "${folder}"`}
                                />
                            </div>

                            <div className="flex items-center justify-between px-6 py-4 border-t border-[color:var(--color-border)] shrink-0 select-none">
                                <p className="text-xs text-[color:var(--color-muted-foreground)] font-medium tabular-nums">
                                    {list.total} archivo{list.total !== 1 ? 's' : ''} en total
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCloseModal}
                                        className="text-xs font-semibold hover:text-[color:var(--color-foreground)]"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={picker.confirm}
                                        disabled={picker.selectionCount === 0}
                                        className="text-xs font-bold px-4 bg-[color:var(--color-action-cta)] hover:bg-[color:var(--color-action-cta-hover)] text-[color:var(--color-action-cta-foreground)] disabled:opacity-50"
                                    >
                                        <FaRegImage className="w-3.5 h-3.5 mr-1.5" />
                                        Insertar Selección ({picker.selectionCount})
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    );
}