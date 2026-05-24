"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "@/src/actions/collection-action";
import { Collection, COLLECTION_TYPES, CollectionType } from "@/src/schemas/collection.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";

interface Props {
    collectionToEdit?: Collection;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    promotion: "Promoción",
    theme: "Temática",
    editorial: "Editorial",
    seasonal: "Temporada",
};

function toDatetimeLocal(date?: Date | string | null): string {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 16);
}

export function CollectionForm({ collectionToEdit }: Props) {
    const router = useRouter();
    const isEditing = !!collectionToEdit;

    const [selectedType, setSelectedType] = useState<CollectionType>(collectionToEdit?.type ?? "theme");
    const [selectedImageUrl, setSelectedImageUrl] = useState(collectionToEdit?.image ?? "");
    const [selectedBannerUrl, setSelectedBannerUrl] = useState(collectionToEdit?.bannerImage ?? "");
    const [availableImages, setAvailableImages] = useState<string[]>([
        ...(collectionToEdit?.image ? [collectionToEdit.image] : []),
        ...(collectionToEdit?.bannerImage ? [collectionToEdit.bannerImage] : []),
    ]);

    const [color, setColor] = useState(collectionToEdit?.color ?? "#ffffff");
    const [badgeColor, setBadgeColor] = useState(collectionToEdit?.badgeColor ?? "#ef4444");

    const actionCall = isEditing
        ? updateCollectionAction.bind(null, collectionToEdit._id)
        : createCollectionAction;

    const [state, formAction, isPending] = useActionState(actionCall, null);

    useEffect(() => {
        if (state?.success) router.push("/admin/collections");
    }, [state?.success, router]);

    const isPromotion = selectedType === "promotion";

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8 bg-background text-foreground">
            <form action={formAction} className="space-y-6">
                <section className="space-y-4">
                    <SectionTitle>Información general</SectionTitle>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label required>Nombre</Label>
                            <Input
                                name="name"
                                defaultValue={collectionToEdit?.name}
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label required>Tipo</Label>
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

                    <div className="space-y-2">
                        <Label>Descripción</Label>
                        <Textarea
                            name="description"
                            defaultValue={collectionToEdit?.description ?? ""}
                            rows={3}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Color hex</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    name="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    disabled={isPending}
                                    className="w-12 h-10 p-1 cursor-pointer shrink-0"
                                />
                                <Input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="#ffffff"
                                    maxLength={7}
                                    disabled={isPending}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Icono</Label>
                            <Input
                                name="icon"
                                defaultValue={collectionToEdit?.icon ?? ""}
                                placeholder="🎄"
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Orden de prioridad</Label>
                            <Input
                                name="order"
                                type="number"
                                defaultValue={collectionToEdit?.order ?? 0}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <SectionTitle>Imágenes</SectionTitle>

                    <div className="space-y-2">
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

                    <div className="space-y-2">
                        <Label>Banner <span className="text-muted-foreground text-xs">(landing de colección)</span></Label>
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
                </section>

                {isPromotion && (
                    <section className="space-y-4">
                        <SectionTitle>Configuración de promoción</SectionTitle>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Fecha de inicio</Label>
                                <Input
                                    name="startsAt"
                                    type="datetime-local"
                                    defaultValue={toDatetimeLocal(collectionToEdit?.startsAt)}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
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
                            <div className="space-y-2">
                                <Label>Etiqueta badge <span className="text-muted-foreground text-xs">Ej: 20% OFF</span></Label>
                                <Input
                                    name="badgeLabel"
                                    defaultValue={collectionToEdit?.badgeLabel ?? ""}
                                    placeholder="20% OFF"
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Color badge</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        name="badgeColor"
                                        value={badgeColor}
                                        onChange={(e) => setBadgeColor(e.target.value)}
                                        disabled={isPending}
                                        className="w-12 h-10 p-1 cursor-pointer shrink-0"
                                    />
                                    <Input
                                        type="text"
                                        value={badgeColor}
                                        onChange={(e) => setBadgeColor(e.target.value)}
                                        placeholder="#ef4444"
                                        maxLength={7}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="space-y-4">
                    <SectionTitle>SEO</SectionTitle>

                    <div className="space-y-2">
                        <Label>
                            Título SEO <span className="text-muted-foreground text-xs">(máx. 60 caracteres)</span>
                        </Label>
                        <Input
                            name="seoTitle"
                            defaultValue={collectionToEdit?.seoTitle ?? ""}
                            maxLength={60}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Descripción SEO <span className="text-muted-foreground text-xs">(máx. 160 caracteres)</span>
                        </Label>
                        <Textarea
                            name="seoDescription"
                            defaultValue={collectionToEdit?.seoDescription ?? ""}
                            maxLength={160}
                            rows={3}
                            disabled={isPending}
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <SectionTitle>Estado</SectionTitle>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background-secondary">
                        <div>
                            <Label htmlFor="isActive" className="font-medium">Colección activa</Label>
                            <p className="text-xs text-muted-foreground">
                                Las colecciones inactivas no son visibles en el sitio
                            </p>
                        </div>
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
                </section>

                {state?.error && (
                    <p className="text-sm font-semibold text-destructive">{state.error}</p>
                )}

                <div className="flex justify-end gap-4 pt-4 border-t border-border">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.push("/admin/collections")}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending} className="bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-semibold px-6">
                        {isPending
                            ? "Guardando..."
                            : isEditing ? "Actualizar colección" : "Crear colección"
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1">
            {children}
        </h2>
    );
}