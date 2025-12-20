"use client";

import { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { uploadImage } from "@/actions/product/upload-image-action";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, UploadCloud, CheckCircle2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Props {
    images: string[]; // Imágenes asignadas a esta variante
    globalImages: string[]; // Imágenes generales del producto (pool)
    setImages: (fn: (prev: string[]) => string[]) => void;
}

export default function UploadVariantImageDialog({ images, globalImages, setImages }: Props) {
    const [isUploading, setIsUploading] = useState(false);

    // Combinamos las imágenes globales con las de la variante para tener un "Pool" único sin duplicados
    const imagePool = useMemo(() => {
        return Array.from(new Set([...globalImages, ...images]));
    }, [globalImages, images]);

    // Función para añadir o quitar imagen de la selección de la variante
    const toggleImage = (img: string) => {
        setImages((prev) => {
            if (prev.includes(img)) {
                return prev.filter((i) => i !== img); // Deseleccionar
            } else {
                return [...prev, img]; // Seleccionar
            }
        });
    };

    const onDrop = useCallback(async (files: File[]) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append("images", file));

            const result = await uploadImage(formData);

            // Las nuevas imágenes subidas se agregan y se seleccionan automáticamente
            setImages(prev => [...prev, ...result.images]);

            toast.success("Imágenes subidas y asignadas");
        } catch {
            toast.error("Error al subir imágenes");
        } finally {
            setIsUploading(false);
        }
    }, [setImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
        onDrop,
        maxFiles: 5,
        disabled: isUploading
    });

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between group/label">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    Multimedia <Badge variant="secondary" className="text-[10px] h-5 px-1">{images.length}</Badge>
                </label>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-2 hover:bg-primary/10 hover:text-primary">
                            <Images className="w-3.5 h-3.5" />
                            Seleccionar / Subir
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-lg flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                Galería de la Variante
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Selecciona imágenes de la biblioteca existente o sube nuevas para esta variante.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Zona de carga */}
                            <div className="px-6 pb-4 pt-2">
                                <div
                                    {...getRootProps()}
                                    className={`
                                        relative h-[120px] flex items-center justify-center border-2 border-dashed rounded-xl transition-all
                                        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/40"}
                                        ${isUploading ? "bg-muted/50 border-none cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                >
                                    <input {...getInputProps()} />
                                    {isUploading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div className="h-0 flex items-center justify-center">
                                                <SpinnerLoading />
                                            </div>
                                            <p className="text-[10px] font-bold text-primary mt-10 animate-pulse">PROCESANDO...</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <UploadCloud className="w-6 h-6 text-muted-foreground" />
                                            <p className="text-xs font-medium">Subir nuevas fotos</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Biblioteca Unificada (Pool) */}
                            <div className="px-6 py-2 bg-muted/20 border-b">
                                <p className="text-xs font-semibold text-muted-foreground">Biblioteca de imágenes ({imagePool.length})</p>
                            </div>

                            <ScrollArea className="flex-1 p-6 bg-muted/5">
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {imagePool.map((img, i) => {
                                        const isSelected = images.includes(img);
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => toggleImage(img)}
                                                className={`
                                                    group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200
                                                    ${isSelected ? "border-primary ring-2 ring-primary/20 shadow-md scale-95" : "border-transparent hover:border-gray-300"}
                                                `}
                                            >
                                                <Image
                                                    src={img}
                                                    alt=""
                                                    fill
                                                    className={`object-cover transition-all ${isSelected ? '' : 'opacity-80 group-hover:opacity-100'}`}
                                                />

                                                {/* Indicador de Selección */}
                                                <div className={`
                                                    absolute inset-0 flex items-center justify-center transition-colors
                                                    ${isSelected ? "bg-primary/10" : "bg-black/0 group-hover:bg-black/5"}
                                                `}>
                                                    {isSelected && (
                                                        <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5 shadow-sm animate-in zoom-in">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {imagePool.length === 0 && !isUploading && (
                                        <div className="col-span-full h-20 flex items-center justify-center text-muted-foreground text-xs italic">
                                            No hay imágenes disponibles. Sube una arriba.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        <DialogFooter className="p-4 border-t bg-white">
                            <div className="flex w-full items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    {images.length} seleccionadas
                                </p>
                                <DialogClose asChild>
                                    <Button size="sm">Listo</Button>
                                </DialogClose>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Preview Miniatura (Solo lectura) */}
            <div className="flex flex-wrap gap-2 min-h-[40px] items-center p-2 rounded-lg border border-dashed bg-gray-50/50">
                {images.length > 0 ? (
                    images.map((img, i) => (
                        <div key={i} className="relative w-10 h-10 rounded border overflow-hidden shadow-sm flex-shrink-0 bg-white">
                            <Image src={img} alt="" fill className="object-cover" />
                        </div>
                    ))
                ) : (
                    <p className="text-[10px] text-muted-foreground pl-1 italic">
                        Sin imágenes asignadas.
                    </p>
                )}
            </div>
        </div>
    );
}