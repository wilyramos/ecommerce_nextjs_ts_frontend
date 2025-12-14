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
import { Images } from "lucide-react" // Ícono de react-icons/lucide-react
import { Label } from "@/components/ui/label"

interface UploadProductImageDialogProps {
    CurrentImagenes?: string[]
    triggerLabel?: string
}

export default function UploadProductImageDialog({
    CurrentImagenes = [],
    triggerLabel = "Gestionar Imágenes",
}: UploadProductImageDialogProps) {
    const [imagenes, setImagenes] = useState<string[]>([])
    const [selected, setSelected] = useState<string[]>([])

    useEffect(() => {
        if (!imagenes.length && CurrentImagenes.length) {
            setImagenes(CurrentImagenes)
            setSelected(CurrentImagenes)
        }
    }, [CurrentImagenes, imagenes])

    const onDrop = useCallback(async (files: File[]) => {
        const formData = new FormData()
        files.forEach(file => formData.append("images", file))
        const result = await uploadImage(formData)
        setImagenes(prev => [...prev, ...result.images])
        setSelected(prev => [...prev, ...result.images])
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"] },
        onDrop,
        maxFiles: 5,
    })

    const toggleSelect = (img: string) =>
        setSelected(prev => prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img])

    return (
        <div className="border-2 rounded-2xl p-4 space-y-4">
            <div className="space-y-2">
                <Label className="mb-1">Imágenes seleccionadas:</Label>
                <div className="flex flex-wrap gap-2">
                    {!selected.length && <p className="text-gray-500">No hay imágenes seleccionadas.</p>}
                    {selected.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                            <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Images className="w-5 h-5" />
                        {triggerLabel}
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Gestión de Imágenes</DialogTitle>
                        <DialogDescription>
                            Sube imágenes o selecciona las que deseas usar para el producto.
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        {...getRootProps({
                            className: `
                flex items-center justify-center text-center 
                border-2 border-dashed rounded-lg transition-colors py-12
                ${isDragActive ? "border-gray-900 bg-gray-100 text-gray-900" : "border-gray-300 bg-white text-gray-400"}
                ${isDragReject ? "border-red-500" : "cursor-pointer"}
              `,
                        })}
                    >
                        <input {...getInputProps()} />
                        {isDragAccept && <p>Suelta las imágenes aquí</p>}
                        {isDragReject && <p>Archivo no válido</p>}
                        {!isDragActive && <p>Arrastra y suelta imágenes, o haz clic para seleccionar</p>}
                    </div>

                    {!!imagenes.length && (
                        <div className="mt-3 space-y-2">
                            <p className="font-semibold">Imágenes subidas:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {imagenes.map((img, i) => {
                                    const selectedImg = selected.includes(img)
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => toggleSelect(img)}
                                            className={`relative w-full h-32 rounded-lg overflow-hidden border-2 transition-all cursor-pointer
                        ${selectedImg ? "border-blue-500" : "border-transparent"}`}
                                        >
                                            <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" />
                                            <div className="absolute top-1 right-1">
                                                <DeleteImageButton image={img} setImagenes={setImagenes} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {selected.map((img, i) => (
                <input key={i} type="hidden" name="imagenes[]" value={img} />
            ))}
        </div>
    )
}
