//File: frontend/components/admin/products/MediaLibraryDialog.tsx

"use client"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogFooter, DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { CheckCircle2, UploadCloud, ImageIcon, Loader2 } from "lucide-react"
import { uploadImage } from "@/actions/product/upload-image-action"
import { toast } from "sonner"

interface MediaLibraryProps {
    selectedImages: string[];      // Imágenes seleccionadas actualmente
    globalImagesPool: string[];    // El pool completo de imágenes disponibles
    onConfirmSelection: (images: string[]) => void;
    onUploadSuccess: (newImages: string[]) => void; // Para avisar al padre de nuevas fotos
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

    // Sincronizar selección cuando abrimos el diálogo
    useEffect(() => {
        setTempSelection(selectedImages);
    }, [selectedImages]);

    const onDrop = useCallback(async (files: File[]) => {
        setIsUploading(true);
        const formData = new FormData();

        // Validar cantidad total
        const totalImages = tempSelection.length + files.length;
        if (totalImages > 15) {
            toast.error(`No se pueden subir más de 15 imágenes. Tienes ${tempSelection.length} seleccionadas.`);
            setIsUploading(false);
            return;
        }

        files.forEach(f => formData.append("images", f));

        try {
            const result = await uploadImage(formData);

            // 1. Informamos al padre sobre las nuevas URLs
            onUploadSuccess(result.images);

            // 2. Las añadimos a la selección actual del diálogo
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
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={triggerVariant}
                    className="gap-2"
                    type="button"
                >
                    <ImageIcon className={sizeClasses[size]} />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl">Biblioteca de Medios</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {allowMultiple
                            ? "Sube nuevas fotos o selecciona las existentes."
                            : "Selecciona una imagen."
                        }
                    </p>
                </DialogHeader>

                <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
                    {/* Zona de Carga */}
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"}
                        ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                    >
                        <input {...getInputProps()} />
                        {isUploading ? (
                            <>
                                <Loader2 className="w-10 h-10 mx-auto mb-2 text-muted-foreground animate-spin" />
                                <p className="font-medium text-sm">Subiendo archivos...</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                                <p className="font-medium text-sm">Arrastra imágenes aquí o haz clic para buscar</p>
                            </>
                        )}
                    </div>

                    {/* Galería de Selección */}
                    <ScrollArea className="flex-1 border rounded-lg bg-muted/5 p-4">
                        {globalImagesPool.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p className="text-sm">No hay imágenes disponibles. Sube una para comenzar.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {globalImagesPool.map(url => {
                                    const isSelected = tempSelection.includes(url);
                                    return (
                                        <div
                                            key={url}
                                            onClick={() => toggleSelection(url)}
                                            className={`group relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                                            ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-muted-foreground/40'}`}
                                        >
                                            <Image
                                                src={url}
                                                alt="Media"
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 shadow-lg">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <DialogFooter className="p-6 bg-muted/20 border-t">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-xs font-medium text-muted-foreground">
                            {tempSelection.length} {allowMultiple ? "imágenes" : "imagen"} seleccionada{tempSelection.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex gap-2">
                            <DialogClose asChild>
                                <Button variant="ghost" type="button">Cancelar</Button>
                            </DialogClose>
                            <Button
                                onClick={handleConfirm}
                                disabled={tempSelection.length === 0}
                                type="button"
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