"use client";
import { useState } from "react";
import { uploadImageBrand } from "@/actions/brand/upload-image-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";

export default function UploadBrandImage({ defaultImage }: { defaultImage?: string }) {
    const [preview, setPreview] = useState(defaultImage ?? "");
    const [loading, setLoading] = useState(false);

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        const form = new FormData();
        form.append("file", file);
        try {
            const res = await uploadImageBrand(form);
            setPreview(res.image);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-3">
            <input type="hidden" name="logo" value={preview} />

            <label
                className={cn(
                    "group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm transition hover:shadow-md hover:border-primary/50",
                    loading && "opacity-60 pointer-events-none"
                )}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="h-full w-full rounded-xl object-contain"
                        />
                        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <span className="text-sm font-medium text-white">
                                Cambiar imagen
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        {loading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        ) : (
                            <ImagePlus className="mb-2 h-10 w-10 text-primary/70" />
                        )}
                        <span className="text-sm text-gray-600">
                            Haz clic o arrastra para subir
                        </span>
                        <span className="mt-1 text-xs text-gray-400">
                            PNG, JPG o GIF (máx. 5 MB)
                        </span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                />
            </label>

            {preview && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreview("")}
                    type="button"
                    className="flex items-center gap-1 rounded-full"
                >
                    <X className="h-4 w-4" />
                    Quitar imagen
                </Button>
            )}
        </div>
    );
}