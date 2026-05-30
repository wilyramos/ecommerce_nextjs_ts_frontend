// EditBrandDialog.tsx
"use client";

import { useActionState, useState, useEffect } from "react";
import { editBrandAction } from "@/actions/brand/edit-brand-action";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/src/services/brands";
import { toast } from "sonner";
import { MediaUploader, MediaImage } from "@/src/modules/media";
import type { Media } from "@/src/modules/media/types/media.types";

export default function EditBrandDialog({
    brand,
    trigger,
}: {
    brand: Brand;
    trigger: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [logo, setLogo] = useState<Media | null>(null);

    // La URL final: si el usuario subió una nueva imagen la usa,
    // si no, conserva la que ya tenía la marca
    const logoUrl = logo?.secureUrl ?? brand.logo ?? '';

    const editBrandWithId = editBrandAction.bind(null, brand._id);
    const [state, dispatch] = useActionState(editBrandWithId, {
        errors: [],
        success: '',
    });

    useEffect(() => {
        if (state.errors?.length) {
            state.errors.forEach((err: string) => toast.error(err));
        }
        if (state.success) {
            toast.success(state.success);
            setOpen(false);
        }
    }, [state]);

    // Reset al cerrar sin guardar
    const handleOpenChange = (value: boolean) => {
        if (!value) setLogo(null);
        setOpen(value);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Editar Marca</DialogTitle>
                </DialogHeader>

                <form action={dispatch} className="space-y-4">
                    <Input
                        name="nombre"
                        defaultValue={brand.nombre}
                        placeholder="Nombre"
                    />
                    <Input
                        name="descripcion"
                        defaultValue={brand.descripcion}
                        placeholder="Descripción"
                    />

                    {/* Campo oculto que llega al Server Action */}
                    <input type="hidden" name="logo" value={logoUrl} />

                    {/* Preview del logo actual o el nuevo */}
                    {logoUrl && !logo && (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                            <MediaImage
                                src={logoUrl}
                                alt={brand.nombre}
                                fill
                                transforms={{ width: 96, height: 96, crop: 'fill' }}
                            />
                        </div>
                    )}

                    <MediaUploader
                        folder="brands"
                        accept="image"
                        maxFiles={1}
                        onSuccess={(media) => setLogo(media[0])}
                        onError={(errors) => errors.forEach((e) => toast.error(e.reason))}
                    />

                    {/* Feedback de imagen nueva seleccionada */}
                    {logo && (
                        <div className="flex items-center gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
                            <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                                <MediaImage
                                    src={logo.secureUrl}
                                    alt="Nuevo logo"
                                    fill
                                    transforms={{ width: 40, height: 40, crop: 'fill' }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-emerald-700 truncate">
                                    Nueva imagen lista
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                    {logo.publicId.split('/').pop()}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setLogo(null)}
                                className="text-xs text-muted-foreground hover:text-foreground shrink-0"
                                aria-label="Quitar nueva imagen"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <Button type="submit" className="w-full">
                        Guardar
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}