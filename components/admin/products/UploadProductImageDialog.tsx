"use client"

import { useState, useEffect, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { uploadImage } from "@/actions/product/upload-image-action"
import DeleteImageButton from "./DeleteImageButton"
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Images, UploadCloud, CheckCircle2, Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface UploadProductImageDialogProps {
    CurrentImagenes?: string[]
    triggerLabel?: string
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 10

export default function UploadProductImageDialog({
    CurrentImagenes = [],
    triggerLabel = "Gestionar Imágenes",
}: UploadProductImageDialogProps) {
    // imagenes: todas las disponibles en la "biblioteca"
    const [imagenes, setImagenes] = useState<string[]>([])
    // selected: las que realmente se enviarán en el form (asignadas al producto)
    const [selected, setSelected] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if (CurrentImagenes.length > 0) {
            setImagenes(prev => Array.from(new Set([...prev, ...CurrentImagenes])))
            setSelected(CurrentImagenes)
        }
    }, [CurrentImagenes])

    const toggleSelect = useCallback((img: string) => {
        setSelected(prev =>
            prev.includes(img)
                ? prev.filter(i => i !== img)
                : [...prev, img]
        )
    }, [])

    const onDrop = useCallback(async (files: File[]) => {
        setIsUploading(true)
        try {
            const formData = new FormData()
            files.forEach(file => formData.append("images", file))

            const result = await uploadImage(formData)

            // Añadir a la biblioteca y seleccionar automáticamente las nuevas
            setImagenes(prev => [...result.images, ...prev])
            setSelected(prev => [...result.images, ...prev])

            toast.success("Imágenes subidas y seleccionadas")
        } catch {
            toast.error("Error al subir las imágenes")
        } finally {
            setIsUploading(false)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: MAX_FILES,
        maxSize: MAX_SIZE,
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    })

    console.log("Imagenes en current:", CurrentImagenes);
    console.log("Imagenes en state:", imagenes);

    return (
        <div className="space-y-4 p-4 border rounded-xl bg-card">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base">Galería del Producto</Label>
                    <p className="text-[10px] text-muted-foreground">
                        {selected.length} imágenes seleccionadas para este producto
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            {triggerLabel}
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="flex items-center gap-2">
                                <Images className="w-5 h-5" />
                                Biblioteca de Medios
                            </DialogTitle>
                            <DialogDescription>
                                Sube nuevas fotos o selecciona imágenes existentes de la tienda Rivas Paredes.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {/* Zona de Carga Estilo Shopify */}
                            <div className="px-6 pb-4">
                                <div
                                    {...getRootProps()}
                                    className={`
                                        relative group cursor-pointer border-2 border-dashed rounded-xl p-6 transition-all duration-200
                                        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                                        ${isUploading ? "opacity-50 pointer-events-none" : ""}
                                    `}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                            <UploadCloud className="w-6 h-6" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">
                                                {isUploading ? "Subiendo archivos..." : "Haz clic o arrastra imágenes aquí"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG o WebP (Máx. 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rejilla de Imágenes Estilo Facebook/Media Library */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                    {imagenes.map((img) => {
                                        const isSelected = selected.includes(img)
                                        return (
                                            <div
                                                key={img}
                                                className={`
                                                    group relative aspect-square rounded-lg overflow-hidden border-2 transition-all
                                                    ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-muted-foreground/50"}
                                                `}
                                            >
                                                <Image
                                                    src={img}
                                                    alt="Media"
                                                    fill
                                                    className={`object-cover transition-transform duration-300 ${isSelected ? 'scale-90' : 'group-hover:scale-110'}`}
                                                />

                                                {/* Overlay de Selección */}
                                                <div
                                                    onClick={() => toggleSelect(img)}
                                                    className={`
                                                        absolute inset-0 cursor-pointer transition-opacity
                                                        ${isSelected ? "bg-primary/10" : "bg-black/0 hover:bg-black/10"}
                                                    `}
                                                />

                                                {/* Checkmark */}
                                                {isSelected && (
                                                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                )}

                                                {/* Botón Borrar Permanente */}
                                                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <DeleteImageButton image={img} setImagenes={setImagenes} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </div>

                        <DialogFooter className="p-6 border-t bg-muted/30">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-xs text-muted-foreground">
                                    {selected.length} de {imagenes.length} seleccionadas
                                </p>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button variant="ghost">Cancelar</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button>Guardar Selección</Button>
                                    </DialogClose>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Preview en el Formulario Principal */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {selected.map((img) => (
                    <div key={img} className="relative aspect-square border rounded-lg overflow-hidden group">
                        <Image src={img} alt="Selected" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => toggleSelect(img)}
                            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                        {/* Campo oculto para el FormData */}
                        <input key={img} type="hidden" name="imagenes[]" value={img} />
                    </div>
                ))}
                {selected.length === 0 && (
                    <div className="col-span-full py-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <Images className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-xs">Sin imágenes asignadas</p>
                    </div>
                )}
            </div>
        </div>
    )
}