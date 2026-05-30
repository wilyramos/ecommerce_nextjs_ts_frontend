// File: frontend/src/components/admin/banner/form-sections/BannerMediaField.tsx
'use client';

import { useState } from 'react';
import { ImageIcon, UploadCloud, FolderOpen, X, Film } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MediaUploader, 
  MediaImage, 
  MediaVideo,
  MediaGrid, 
  useMediaList, 
  useMediaPicker 
} from '@/src/modules/media';
import type { Media } from '@/src/modules/media';

interface BannerMediaFieldProps {
  defaultImageUrl?: string;
  defaultVideoUrl?: string;
  errorImage?: string;
  errorVideo?: string;
}

export default function BannerMediaField({ 
  defaultImageUrl = '', 
  defaultVideoUrl = '',
  errorImage,
  errorVideo 
}: BannerMediaFieldProps) {
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl);
  const [videoUrl, setVideoUrl] = useState<string>(defaultVideoUrl);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [targetType, setTargetType] = useState<'image' | 'video'>('image');

  // Inicialización del motor transaccional de selección del módulo de medios
  const picker = useMediaPicker({
    multiple: false,
    maxSelectable: 1,
    onConfirm: (selected: Media[]) => {
      if (selected.length > 0) {
        if (targetType === 'image') {
          setImageUrl(selected[0].secureUrl);
        } else {
          setVideoUrl(selected[0].secureUrl);
        }
        setIsSelectorOpen(false);
      }
    },
    onClose: () => setIsSelectorOpen(false),
  });

  // Query Hook para la paginación e indexación de archivos
  const list = useMediaList({
    folder: 'banners',
    limit: 24,
    autoFetch: isSelectorOpen && activeTab === 'library',
  });

  const handleUploadSuccess = (uploaded: Media[]) => {
    if (uploaded.length > 0) {
      if (targetType === 'image') {
        setImageUrl(uploaded[0].secureUrl);
      } else {
        setVideoUrl(uploaded[0].secureUrl);
      }
      setIsSelectorOpen(false);
    }
  };

  const openSelector = (type: 'image' | 'video') => {
    setTargetType(type);
    setActiveTab('library');
    setIsSelectorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Inputs ocultos nativos para la transferencia de valores en el submit del Form */}
      <input type="hidden" name="media.imageUrl" value={imageUrl} />
      <input type="hidden" name="media.videoUrl" value={videoUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ── SECCIÓN IMAGEN ── */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground">Imagen del Banner (Obligatorio / Poster)</Label>
          {imageUrl ? (
            <div className="relative group border border-border rounded-sm overflow-hidden bg-muted-neutral aspect-video flex items-center justify-center">
              <MediaImage
                src={imageUrl}
                alt="Vista previa de la imagen"
                fill
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openSelector('image')}
                  className="h-8 text-xs font-semibold bg-background text-foreground border-border hover:border-border-hover cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  Cambiar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setImageUrl('')}
                  className="h-8 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Quitar
                </Button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => openSelector('image')}
              className={`border border-dashed rounded-sm p-6 text-center bg-background-secondary/50 hover:bg-background-secondary hover:border-border-hover transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 aspect-video ${
                errorImage ? 'border-destructive' : 'border-border/60'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Asignar Imagen</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Biblioteca o subir archivo</p>
              </div>
            </div>
          )}
          {errorImage && <p className="text-[10px] text-destructive font-medium">{errorImage}</p>}
        </div>

        {/* ── SECCIÓN VIDEO ── */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground">Video del Banner (Opcional)</Label>
          {videoUrl ? (
            <div className="relative group border border-border rounded-sm overflow-hidden bg-muted-neutral aspect-video flex items-center justify-center">
              <MediaVideo
                src={videoUrl}
                controls={false}
                autoPlay={true}
                muted={true}
                loop={true}
                aspectRatio="16:9"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openSelector('video')}
                  className="h-8 text-xs font-semibold bg-background text-foreground border-border hover:border-border-hover cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 mr-1" />
                  Cambiar
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setVideoUrl('')}
                  className="h-8 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Quitar
                </Button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => openSelector('video')}
              className={`border border-dashed rounded-sm p-6 text-center bg-background-secondary/50 hover:bg-background-secondary hover:border-border-hover transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 aspect-video ${
                errorVideo ? 'border-destructive' : 'border-border/60'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Asignar Video</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Biblioteca o subir archivo</p>
              </div>
            </div>
          )}
          {errorVideo && <p className="text-[10px] text-destructive font-medium">{errorVideo}</p>}
        </div>
      </div>

      <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 border border-border bg-background shadow-2xl outline-none rounded-sm">
          <DialogHeader className="p-5 pb-1 text-start shrink-0">
            <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
              Asignar {targetType === 'image' ? 'Imagen' : 'Video'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground font-medium">Buscando recursos compatibles en la carpeta banners</p>
            
            <div className="flex gap-2 mt-4 border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'library'
                    ? 'border-action-cta text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5 inline mr-1.5" />
                Explorar Biblioteca
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-action-cta text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 inline mr-1.5" />
                Subir Nuevo Recurso
              </button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden relative min-h-0 bg-background-secondary/20 flex flex-col">
            {activeTab === 'library' ? (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <MediaGrid
                    media={list.media.filter(item => item.resourceType === targetType)}
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
                    emptyMessage={`No hay ${targetType === 'image' ? 'imágenes' : 'videos'} disponibles en la carpeta "banners"`}
                  />
                </div>
                
                <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-background shrink-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    Filtrando elementos de tipo {targetType}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      type="button" 
                      onClick={() => setIsSelectorOpen(false)}
                      className="text-xs h-9 rounded-sm font-semibold cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={picker.confirm}
                      disabled={picker.selectionCount === 0}
                      className="bg-primary text-primary-foreground text-xs font-bold px-5 h-9 rounded-md hover:bg-action-cta hover:text-action-cta-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Confirmar Selección {picker.selectionCount > 0 && `(${picker.selectionCount})`}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 h-full overflow-y-auto">
                <div className="p-6 border border-border bg-background rounded-sm shadow-sm">
                  <MediaUploader
                    folder="banners"
                    accept={targetType}
                    multiple={false}
                    maxFiles={1}
                    onSuccess={handleUploadSuccess}
                  />
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}