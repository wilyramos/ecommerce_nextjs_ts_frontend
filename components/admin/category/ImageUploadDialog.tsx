"use client";

import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { uploadImageBrand } from "@/actions/brand/upload-image-action";
import Image from "next/image";
import { useState } from "react";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import { useRef } from "react";
import { toast } from "sonner";

type Props = {
    image?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
};

export function ImageUploadDialog({ image, inputRef }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(image);
    const [isUploading, setIsUploading] = useState(false);
    const [open, setOpen] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Por favor, selecciona un archivo de imagen válido.");
            return;
        }
        if (file.size > 1 * 1024 * 1024) { // 1MB
            toast.error("El tamaño de la imagen no debe superar los 1MB.");
            return;
        }

        console.log("Archivo válido");

        setIsUploading(true);

        const form = new FormData();
        form.append("file", file);

        try {
            const result = await uploadImageBrand(form);
            if (result?.image) {
                setUploadedUrl(result.image);
                if (inputRef.current) {
                    inputRef.current.value = result.image;
                }
                setOpen(false);
            }
        } finally {
            setIsUploading(false);
        }
    }

    function handleRemove() {
        setUploadedUrl(undefined);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-start gap-2 w-full cursor-pointer">
                    <button
                        type="button"
                        className="w-full border rounded-lg p-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                        {uploadedUrl ? "Cambiar imagen" : "Subir imagen"}
                    </button>

                    <div className="w-24 h-24 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                        {uploadedUrl ? (
                            <Image
                                src={uploadedUrl}
                                alt="Category"
                                className="object-contain"
                                width={96}
                                height={96}
                                priority={!!uploadedUrl}
                            />
                        ) : (
                            <span className="text-gray-400 text-xs">No hay imagen</span>
                        )}
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Subir imagen de categoría</DialogTitle>
                    <DialogDescription>
                        Selecciona una imagen representativa para esta categoría.
                    </DialogDescription>
                </DialogHeader>

                <div
                    className={`relative border-2 border-dashed rounded-xl h-44 flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition overflow-hidden ${isUploading ? "opacity-60" : ""
                        }`}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <SpinnerLoading />
                    ) : uploadedUrl ? (
                        <Image
                            src={uploadedUrl}
                            alt="Category"
                            fill
                            className="object-contain rounded-lg"
                        />
                    ) : (
                        <span className="text-gray-500 text-sm">
                            Haz clic para seleccionar una imagen
                        </span>
                    )}
                </div>

                {/* Input file oculto */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />

                <DialogFooter className="flex justify-between">
                    {uploadedUrl && !isUploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-red-600 text-sm hover:underline"
                        >
                            Eliminar imagen
                        </button>
                    )}
                    <DialogClose asChild>

                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}