"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { uploadImage } from "@/actions/product/upload-image-action";
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";


interface Props {
    images: string[];
    setImages: (fn: (prev: string[]) => string[]) => void;
}

export default function UploadVariantImageDialog({ images, setImages }: Props) {

    const onDrop = useCallback(async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => formData.append("images", file));

        const result = await uploadImage(formData);

        setImages(prev => [...prev, ...result.images]);
    }, [setImages]);

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } =
        useDropzone({
            accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"] },
            onDrop,
            maxFiles: 5,
        });

    return (

        <>

            <div className="border p-2">
                <label className="block text-gray-700 font-semibold mb-2">Imágenes Seleccionadas:</label>
                <div className="flex flex-wrap gap-2">
                    {!images.length && <p className="text-gray-500">No hay imágenes seleccionadas.</p>}
                    {images.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                            <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" quality={10} />
                        </div>
                    ))}
                </div>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Images className="w-4 h-4" />
                        Imágenes
                    </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Imágenes de la variante</DialogTitle>
                        <DialogDescription>
                            Sube o elimina imágenes específicas de esta variante.
                        </DialogDescription>
                    </DialogHeader>

                    <div
                        {...getRootProps({
                            className: `
                            text-center border-2 border-dashed rounded-lg p-6
                            ${isDragActive ? "border-black bg-gray-100" : "border-gray-300 bg-white"}
                        `
                        })}
                    >
                        <input {...getInputProps()} />
                        {isDragAccept && "Suelta las imágenes aquí"}
                        {isDragReject && "Archivo no válido"}
                        {!isDragActive && "Arrastra imágenes o haz clic para subir"}
                    </div>

                    {images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative w-full h-24 rounded-md overflow-hidden border">
                                    <Image src={img} alt="" fill className="object-cover" quality={10} />

                                    <div className="absolute top-1 right-1">
                                        {/* DeleteImageButton  */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImages((prev) => prev.filter((image) => image !== img));
                                            }}
                                            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition duration-200 cursor-pointer"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cerrar</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}
