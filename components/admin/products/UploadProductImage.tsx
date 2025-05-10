"use client";

import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import Image from "next/image";

export default function UploadProductImage() {
    const [image, setImage] = useState("");

    const onDrop = useCallback(async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("file", file);
        });
        // const image = await uploadImage(formData)

        setImage(image);
    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        isDragAccept,
    } = useDropzone({
        accept: {
            "image/jpeg": [".jpg"],
            "image/png": [".png"],
        },
        onDrop,
        maxFiles: 1,
    });

    return (
        <div className="space-y-4">
            <label
                htmlFor="dropzone-file"
                className="block text-sm font-medium text-gray-700"
            >
                Imagen del Producto
            </label>
            <div
                {...getRootProps({
                    className: `
            flex justify-center items-center w-full h-48 sm:h-64 border-2 border-dashed rounded-lg
            ${isDragActive
                            ? "border-indigo-500 bg-indigo-50"
                            : isDragReject
                                ? "border-red-500 bg-red-50"
                                : "border-gray-300 bg-gray-50"
                        }
            ${isDragAccept && "border-green-500 bg-green-50"}
            cursor-pointer
            focus:outline-none
            transition duration-300 ease-in-out
          `,
                })}
            >
                <div className="flex flex-col justify-center items-center space-y-2">

                    <p className="block text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Haz click para subir</span> o arrastra
                        y suelta
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        JPG o PNG
                    </p>
                    {isDragAccept && (
                        <p className="text-green-500 text-sm">¡Suelta la imagen!</p>
                    )}
                    {isDragReject && (
                        <p className="text-red-500 text-sm">¡Archivo no válido!</p>
                    )}
                </div>
                <input {...getInputProps()} id="dropzone-file" type="file" className="hidden" />
            </div>

            {image && (
                <div className="mt-6 space-y-3">
                    <p className="font-semibold text-gray-700">Imagen Cargada:</p>
                    <div className="relative w-48 h-48 rounded-md shadow-md overflow-hidden">
                        <Image
                            src={image}
                            alt="Imagen Producto"
                            className="object-cover"
                            fill
                        />
                    </div>
                </div>
            )}

            <input type="hidden" name="image" value={image} />
        </div>
    );
}