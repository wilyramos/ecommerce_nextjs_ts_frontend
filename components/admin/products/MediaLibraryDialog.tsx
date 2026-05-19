//File: frontend/components/admin/products/MediaLibraryDialog.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { CheckCircle2, UploadCloud, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/actions/product/upload-image-action";
import { toast } from "sonner";

interface MediaLibraryProps {
    selectedImages: string[];
    globalImagesPool: string[];
    onConfirmSelection: (images: string[]) => void;
    onUploadSuccess: (newImages: string[]) => void;
    allowMultiple?: boolean;
    triggerLabel?: string;
    triggerVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
    size?: "sm" | "md" | "lg";
}

export default function MediaLibraryDialog({
    selectedImages,
    globalImagesPool,
    onConfirmSelection,
    onUploadSuccess,
    allowMultiple = true,
    triggerLabel = "Gestionar Multimedia",
    triggerVariant = "default",
    size = "sm"
}: MediaLibraryProps) {
    const [tempSelection, setTempSelection] = useState<string[]>(selectedImages);
    const [isUploading, setIsUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setTempSelection(selectedImages);
    }, [selectedImages]);

    const onDrop = useCallback(async (files: File[]) => {
        setIsUploading(true);
        const formData = new FormData();

        const totalImages = tempSelection.length + files.length;
        if (totalImages > 15) {
            toast.error(`No se pueden subir más de 15 imágenes. Tienes ${tempSelection.length} seleccionadas.`);
            setIsUploading(false);
            return;
        }

        files.forEach(f => formData.append("images", f));

        try {
            const result = await uploadImage(formData);
            onUploadSuccess(result.images);

            setTempSelection(prev =>
                allowMultiple
                    ? [...prev, ...result.images]
                    : [result.images[0]]
            );

            toast.success(`${result.images.length} imagen(es) subida(s) correctamente`);
        } catch (error) {
            console.error("Error al subir imágenes:", error);
            toast.error("Error al subir imágenes. Intenta de nuevo.");
        } finally {
            setIsUploading(false);
        }
    }, [onUploadSuccess, allowMultiple, tempSelection.length]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
            "image/avif": [".avif"],
            "image/gif": [".gif"],
            "image/svg+xml": [".svg"],
            "image/heic": [".heic"],
            "image/heif": [".heif"],
            "image/bmp": [".bmp"],
            "image/tiff": [".tiff", ".tif"]
        },
        disabled: isUploading,
        multiple: true
    });

    const toggleSelection = (url: string) => {
        setTempSelection(prev => {
            if (prev.includes(url)) return prev.filter(i => i !== url);
            return allowMultiple ? [...prev, url] : [url];
        });
    };

    const handleConfirm = () => {
        onConfirmSelection(tempSelection);
        setIsOpen(false);
    };

    const sizeClasses = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5"
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={triggerVariant}
                    className="gap-1.5 text-xs font-bold px-4 h-9 rounded-sm cursor-pointer"
                    type="button"
                >
                    <ImageIcon className={sizeClasses[size]} />
                    <span>{triggerLabel}</span>
                </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 border border-border bg-background shadow-xs outline-none rounded-sm">
                <DialogHeader className="p-5 pb-1 text-start">
                    <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">Biblioteca de Medios</DialogTitle>
                    <p className="text-xs text-muted-foreground font-medium">
                        {allowMultiple
                            ? "Sube nuevas fotos o selecciona las existentes."
                            : "Selecciona una imagen."
                        }
                    </p>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden px-5 py-3 gap-4">
                    {/* Zona de Carga */}
                    <div
                        {...getRootProps()}
                        className={`border border-dashed rounded-sm p-6 text-center transition-colors cursor-pointer outline-none
                        ${isDragActive ? "border-action-cta bg-background-secondary/40" : "border-border/60 bg-background-secondary/20 hover:border-muted-foreground/60"}
                        ${isUploading ? "opacity-40 pointer-events-none" : ""}`}
                    >
                        <input {...getInputProps()} />
                        {isUploading ? (
                            <div className="flex flex-col items-center justify-center py-2">
                                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin mb-2" />
                                <p className="font-bold text-xs text-muted-foreground">Subiendo archivos...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2">
                                <UploadCloud className="w-6 h-6 text-muted-foreground/80 mb-1.5" />
                                <p className="font-bold text-xs text-foreground">Arrastra imágenes aquí o haz clic para buscar</p>
                            </div>
                        )}
                    </div>

                    {/* Galería de Selección */}
                    <ScrollArea className="flex-1 border border-border/40 rounded-sm bg-background p-3">
                        {globalImagesPool.length === 0 ? (
                            <div className="flex items-center justify-center h-48 text-muted-foreground/60 font-medium">
                                <p className="text-xs">No hay imágenes disponibles. Sube una para comenzar.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {globalImagesPool.map(url => {
                                    const isSelected = tempSelection.includes(url);
                                    return (
                                        <div
                                            key={url}
                                            onClick={() => toggleSelection(url)}
                                            className={`group relative aspect-square cursor-pointer rounded-sm overflow-hidden border transition-all p-1 flex items-center justify-center bg-background
                                            ${isSelected ? "border-action-cta ring-1 ring-action-cta/20" : "border-border/40 hover:border-muted-foreground/50"}`}
                                        >
                                            <Image
                                                src={url}
                                                alt="Media"
                                                fill
                                                className="object-contain p-1 mix-blend-multiply"
                                                unoptimized
                                            />
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 text-action-cta bg-background rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle2 size={14} className="fill-current text-action-cta stroke-background" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-foreground/3 layer opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-4 bg-background-secondary/50 border-t border-border/60">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs font-bold text-muted-foreground">
                            {tempSelection.length} {allowMultiple ? "imágenes" : "imagen"} seleccionada{tempSelection.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button variant="ghost" type="button" className="text-xs h-9 rounded-sm font-semibold cursor-pointer">Cancelar</Button>
                            </DialogClose>
                            <Button
                                onClick={handleConfirm}
                                disabled={tempSelection.length === 0}
                                type="button"
                                className="bg-foreground text-background text-xs font-bold px-5 h-9 rounded-full hover:bg-action-cta hover:text-primary-foreground transition-colors cursor-pointer"
                            >
                                Aplicar Selección
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}