"use client";

import { useActionState, useEffect, useState } from "react";
import { createCollectionAction, updateCollectionAction } from "@/src/actions/collection-action";
import { Collection } from "@/src/schemas/collection.schema";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    collectionToEdit: Collection | null;
}

export default function CollectionModal({ isOpen, onClose, collectionToEdit }: Props) {
    // Estado para la imagen seleccionada
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(collectionToEdit?.image || "");
    const [availableImages, setAvailableImages] = useState<string[]>(
        collectionToEdit?.image ? [collectionToEdit.image] : []
    );

    const actionCall = collectionToEdit
        ? updateCollectionAction.bind(null, collectionToEdit._id)
        : createCollectionAction;

    const [state, formAction, isPending] = useActionState(actionCall, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-background border border-border rounded-sm shadow-xs outline-none">
                <DialogHeader>
                    <DialogTitle className="text-xs font-bold uppercase tracking-widest text-foreground">
                        {collectionToEdit ? `Editar: ${collectionToEdit.name}` : "Nueva Colección"}
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label required>Nombre de la colección</Label>
                        <Input name="name" defaultValue={collectionToEdit?.name} required disabled={isPending} />
                    </div>

                    {/* Imagen con MediaLibraryDialog */}
                    <div className="space-y-1.5">
                        <Label>Imagen destacada</Label>
                        <div className="flex gap-2">
                            <Input 
                                name="image" 
                                value={selectedImageUrl} 
                                readOnly 
                                placeholder="Selecciona una imagen..." 
                                disabled={isPending}
                            />
                            <MediaLibraryDialog
                                selectedImages={selectedImageUrl ? [selectedImageUrl] : []}
                                globalImagesPool={availableImages}
                                onConfirmSelection={(imgs) => setSelectedImageUrl(imgs[0] || "")}
                                onUploadSuccess={(newImgs) => setAvailableImages(prev => [...prev, ...newImgs])}
                                allowMultiple={false}
                                triggerLabel="Elegir"
                                triggerVariant="outline"
                                size="sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label>Color Hex</Label>
                            <Input name="color" defaultValue={collectionToEdit?.color || ""} placeholder="#ffffff" disabled={isPending} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Orden de prioridad</Label>
                            <Input name="order" type="number" defaultValue={collectionToEdit?.order ?? 0} disabled={isPending} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Descripción corta</Label>
                        <Textarea name="description" defaultValue={collectionToEdit?.description || ""} rows={2} disabled={isPending} />
                    </div>

                    <div className="border-t border-border/40 pt-4 space-y-3">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Configuración SEO</Label>
                        <div className="space-y-1.5">
                            <Label>Título SEO</Label>
                            <Input name="seoTitle" defaultValue={collectionToEdit?.seoTitle || ""} disabled={isPending} />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Descripción SEO</Label>
                            <Textarea name="seoDescription" defaultValue={collectionToEdit?.seoDescription || ""} rows={2} disabled={isPending} />
                        </div>
                    </div>

                    
                    <div className="flex items-center justify-between pt-2">
                        <Label htmlFor="isActive">Colección activa</Label>
                        <input type="hidden" name="isActive" value={String(collectionToEdit?.isActive ?? true)} />
                        <Switch 
                            id="isActive"
                            defaultChecked={collectionToEdit?.isActive ?? true}
                            onCheckedChange={(checked) => {
                                const input = document.querySelector('input[name="isActive"]') as HTMLInputElement;
                                if (input) input.value = String(checked);
                            }}
                            disabled={isPending}
                        />
                    </div>

                    {state?.error && (
                        <p className="text-[10px] font-bold text-destructive">{state.error}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="text-xs">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="text-xs font-bold px-6">
                            {isPending ? "Guardando..." : "Guardar Colección"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}