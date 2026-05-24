"use client";

import { useActionState, useEffect, useState } from "react";
import { createCollectionAction, updateCollectionAction } from "@/src/actions/collection-action";
import { Collection, COLLECTION_TYPES, CollectionType } from "@/src/schemas/collection.schema";

// UI Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    collectionToEdit: Collection | null;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    promotion: "Promoción",
    theme:     "Temática",
    editorial: "Editorial",
    seasonal:  "Temporada",
};

// Convierte Date a string compatible con datetime-local input
function toDatetimeLocal(date?: Date | string | null): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export default function CollectionModal({ isOpen, onClose, collectionToEdit }: Props) {
    const [selectedType, setSelectedType]     = useState<CollectionType>(collectionToEdit?.type ?? "theme");
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(collectionToEdit?.image ?? "");
    const [selectedBannerUrl, setSelectedBannerUrl] = useState<string>(collectionToEdit?.bannerImage ?? "");
    const [availableImages, setAvailableImages] = useState<string[]>([
        ...(collectionToEdit?.image       ? [collectionToEdit.image]       : []),
        ...(collectionToEdit?.bannerImage ? [collectionToEdit.bannerImage] : []),
    ]);

    const actionCall = collectionToEdit
        ? updateCollectionAction.bind(null, collectionToEdit._id)
        : createCollectionAction;

    const [state, formAction, isPending] = useActionState(actionCall, null);

    useEffect(() => {
        if (state?.success) onClose();
    }, [state?.success, onClose]);

    // Sincronizar estado cuando cambia la colección a editar
    useEffect(() => {
        setSelectedType(collectionToEdit?.type ?? "theme");
        setSelectedImageUrl(collectionToEdit?.image ?? "");
        setSelectedBannerUrl(collectionToEdit?.bannerImage ?? "");
    }, [collectionToEdit]);

    const isPromotion = selectedType === "promotion";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-background border border-border rounded-sm shadow-xs outline-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xs font-bold uppercase tracking-widest text-foreground">
                        {collectionToEdit ? `Editar: ${collectionToEdit.name}` : "Nueva Colección"}
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction} className="space-y-4 pt-2">

                    {/* ── NOMBRE Y TIPO ── */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label required>Nombre</Label>
                            <Input
                                name="name"
                                defaultValue={collectionToEdit?.name}
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label required>Tipo</Label>
                            {/* Hidden input para que FormData lo capture */}
                            <input type="hidden" name="type" value={selectedType} />
                            <Select
                                value={selectedType}
                                onValueChange={(v) => setSelectedType(v as CollectionType)}
                                disabled={isPending}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COLLECTION_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {COLLECTION_TYPE_LABELS[t]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* ── CAMPOS SOLO PARA PROMOCIONES ── */}
                    {isPromotion && (
                        <div className="border border-border/40 rounded-sm p-3 space-y-3 bg-muted/30">
                            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                Configuración de Promoción
                            </Label>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Fecha de inicio</Label>
                                    <Input
                                        name="startsAt"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(collectionToEdit?.startsAt)}
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Fecha de fin</Label>
                                    <Input
                                        name="endsAt"
                                        type="datetime-local"
                                        defaultValue={toDatetimeLocal(collectionToEdit?.endsAt)}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Etiqueta badge</Label>
                                    <Input
                                        name="badgeLabel"
                                        defaultValue={collectionToEdit?.badgeLabel ?? ""}
                                        placeholder="Ej: 20% OFF"
                                        disabled={isPending}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Color badge</Label>
                                    <Input
                                        name="badgeColor"
                                        defaultValue={collectionToEdit?.badgeColor ?? ""}
                                        placeholder="#ef4444"
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── IMÁGENES ── */}
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
                                onConfirmSelection={(imgs) => setSelectedImageUrl(imgs[0] ?? "")}
                                onUploadSuccess={(newImgs) => setAvailableImages(prev => [...prev, ...newImgs])}
                                allowMultiple={false}
                                triggerLabel="Elegir"
                                triggerVariant="outline"
                                size="sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Banner (landing de colección)</Label>
                        <div className="flex gap-2">
                            <Input
                                name="bannerImage"
                                value={selectedBannerUrl}
                                readOnly
                                placeholder="Selecciona un banner..."
                                disabled={isPending}
                            />
                            <MediaLibraryDialog
                                selectedImages={selectedBannerUrl ? [selectedBannerUrl] : []}
                                globalImagesPool={availableImages}
                                onConfirmSelection={(imgs) => setSelectedBannerUrl(imgs[0] ?? "")}
                                onUploadSuccess={(newImgs) => setAvailableImages(prev => [...prev, ...newImgs])}
                                allowMultiple={false}
                                triggerLabel="Elegir"
                                triggerVariant="outline"
                                size="sm"
                            />
                        </div>
                    </div>

                    {/* ── APARIENCIA ── */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label>Color hex</Label>
                            <Input
                                name="color"
                                defaultValue={collectionToEdit?.color ?? ""}
                                placeholder="#ffffff"
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Icono</Label>
                            <Input
                                name="icon"
                                defaultValue={collectionToEdit?.icon ?? ""}
                                placeholder="🎄"
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Orden</Label>
                            <Input
                                name="order"
                                type="number"
                                defaultValue={collectionToEdit?.order ?? 0}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Descripción</Label>
                        <Textarea
                            name="description"
                            defaultValue={collectionToEdit?.description ?? ""}
                            rows={2}
                            disabled={isPending}
                        />
                    </div>

                    {/* ── SEO ── */}
                    <div className="border-t border-border/40 pt-4 space-y-3">
                        <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            SEO
                        </Label>
                        <div className="space-y-1.5">
                            <Label>Título SEO <span className="text-muted-foreground">(máx. 60)</span></Label>
                            <Input
                                name="seoTitle"
                                defaultValue={collectionToEdit?.seoTitle ?? ""}
                                maxLength={60}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>Descripción SEO <span className="text-muted-foreground">(máx. 160)</span></Label>
                            <Textarea
                                name="seoDescription"
                                defaultValue={collectionToEdit?.seoDescription ?? ""}
                                maxLength={160}
                                rows={2}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* ── ESTADO ── */}
                    <div className="flex items-center justify-between border-t border-border/40 pt-4">
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

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="text-xs">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending} className="text-xs font-bold px-6">
                            {isPending ? "Guardando..." : collectionToEdit ? "Actualizar" : "Crear Colección"}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}