"use client"

import { useState, useEffect, useCallback } from "react"
import { useDropzone, FileRejection, ErrorCode } from "react-dropzone"
import Image from "next/image"
import { uploadImage } from "@/actions/product/upload-image-action"
import DeleteImageButton from "./DeleteImageButton"
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Images } from "lucide-react"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface UploadProductImageDialogProps {
    CurrentImagenes?: string[]
    triggerLabel?: string
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 5

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

    const toggleSelect = useCallback((img: string) => {
        setSelected(prev =>
            prev.includes(img)
                ? prev.filter(i => i !== img)
                : [...prev, img]
        )
    }, [])

    const onDropRejected = useCallback((rejections: FileRejection[]) => {
        rejections.forEach(({ file, errors }) => {
            errors.forEach(error => {
                switch (error.code as ErrorCode) {
                    case "file-too-large":
                        toast.error(`"${file.name}" supera los 5MB`)
                        break
                    case "file-invalid-type":
                        toast.error(`"${file.name}" no es un formato permitido`)
                        break
                    case "too-many-files":
                        toast.error(`Máximo ${MAX_FILES} imágenes`)
                        break
                    default:
                        toast.error(`Error al subir "${file.name}"`)
                }
            })
        })
    }, [])

    const onDrop = useCallback(async (files: File[]) => {
        try {
            const formData = new FormData()
            files.forEach(file => formData.append("images", file))

            const result = await uploadImage(formData)

            setImagenes(prev => [...prev, ...result.images])
            setSelected(prev => [...prev, ...result.images])

            toast.success("Imágenes subidas correctamente")

        } catch {
            toast.error("Error al subir las imágenes")
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } =
        useDropzone({
            onDrop,
            onDropRejected,
            maxFiles: MAX_FILES,
            maxSize: MAX_SIZE,
            accept: {
                "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
            },
        })

    return (
        <div className="border-2 rounded-2xl p-4 space-y-4">

            <Label>Imágenes seleccionadas</Label>
            <div className="flex flex-wrap gap-2">
                {!selected.length && (
                    <p className="text-gray-500">No hay imágenes seleccionadas.</p>
                )}
                {selected.map((img) => (
                    <div
                        key={img}
                        onClick={() => toggleSelect(img)}
                        className="relative w-24 h-24 border rounded-lg overflow-hidden cursor-pointer"
                    >
                        <Image src={img} alt="" fill className="object-cover" />
                    </div>
                ))}
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
                            Arrastra imágenes o selecciónalas
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        {...getRootProps({
                            className: `
                flex items-center justify-center text-center
                border-2 border-dashed rounded-lg py-12 transition
                ${isDragAccept && "border-green-500 bg-green-50"}
                ${isDragReject && "border-red-500 bg-red-50"}
                ${!isDragActive && "border-gray-300"}
              `,
                        })}
                    >
                        <input {...getInputProps()} />
                        {isDragAccept && <p>Suelta las imágenes aquí</p>}
                        {isDragReject && <p>Archivo no válido</p>}
                        {!isDragActive && <p>Arrastra o haz clic para seleccionar</p>}
                    </div>

                    {!!imagenes.length && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {imagenes.map(img => {
                                const isSelected = selected.includes(img)
                                return (
                                    <div
                                        key={img}
                                        onClick={() => toggleSelect(img)}
                                        className={`relative h-32 rounded-lg overflow-hidden border-2 cursor-pointer
                      ${isSelected ? "border-blue-500" : "border-transparent"}
                    `}
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                        <div className="absolute top-1 right-1">
                                            <DeleteImageButton image={img} setImagenes={setImagenes} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {selected.map(img => (
                <input key={img} type="hidden" name="imagenes[]" value={img} />
            ))}
        </div>
    )
}
