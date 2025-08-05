"use client"

import { useDropzone } from "react-dropzone"
import { useCallback, useEffect, useState } from "react"
import { uploadImage } from "@/actions/product/upload-image-action"
import Image from "next/image"
import DeleteImageButton from "./DeleteImageButton"

interface UploadProductImageProps {
    CurrentImagenes?: string[]
}

export default function UploadProductImage({ CurrentImagenes = [] }: UploadProductImageProps) {
    const [imagenes, setImagenes] = useState<string[]>([])

    // Usamos useEffect solo para establecer las imágenes iniciales
    useEffect(() => {
        if (imagenes.length === 0 && CurrentImagenes.length > 0) {
            setImagenes(CurrentImagenes)
        }
    }, [CurrentImagenes, imagenes])

    // Subir imágenes nuevas
    const onDrop = useCallback(async (files: File[]) => {
        const formData = new FormData()
        files.forEach(file => formData.append('images', file))

        const result = await uploadImage(formData)
        setImagenes(prev => [...prev, ...result.images])
    }, [])

    // Configuración Dropzone
    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
        },
        onDrop,
        maxFiles: 3,
    })

    return (
        <>
            <div className="space-y-1">
                <label className="block text-gray-700 font-semibold">
                    Imagen Producto
                </label>
                <div
                    {...getRootProps({
                        className: `
                            flex items-center justify-center text-center 
                            border-2 border-dashed rounded-lg transition-colors
                            ${isDragActive ? 'border-gray-900 bg-gray-100 text-gray-900' : 'border-gray-300 bg-white text-gray-400'}
                            ${isDragReject ? 'border-red-500 bg-white' : 'cursor-pointer'}
                            py-16
                        `
                    })}
                >
                    <input {...getInputProps()} />
                    {isDragAccept && (<p>Suelta la imagen aquí</p>)}
                    {isDragReject && (<p>Archivo no válido</p>)}
                    {!isDragActive && (<p>Arrastra y suelta una imagen, o haz clic para seleccionar</p>)}
                </div>
            </div>

            {imagenes.length > 0 && (
                <div className="py-2 space-y-2">
                    <p className="font-bold">Imágenes:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {imagenes.map((img, index) => (
                            <div
                                key={index}
                                className="relative w-48 h-48 rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={img}
                                    alt={`Imagen ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                    quality={10}
                                    priority
                                />
                                <DeleteImageButton
                                    image={img}
                                    setImagenes={setImagenes}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {imagenes.map((img, index) => (
                <input
                    key={index}
                    type="hidden"
                    name="imagenes[]"
                    value={img}
                />
            ))}
        </>
    )
}
