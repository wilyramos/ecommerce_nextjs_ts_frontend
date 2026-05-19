"use client";

import { useState } from "react";
import { Info, ImageIcon, Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SliderContentTypeEnum, SliderObjectFitEnum, SliderBorderStyleEnum, type SliderBanner } from "@/src/schemas/slider.schema";
import ProductReferenceSelector from "../../shared/ProductReferenceSelector";
import MediaLibraryDialog from "@/components/admin/products/MediaLibraryDialog";

interface SectionProps {
    initialData?: SliderBanner;
    fields?: Record<string, string>;
    fieldErrors?: Record<string, string[]>;
}

export default function GeneralSection({ initialData, fields, fieldErrors }: SectionProps) {
    const [availableImages, setAvailableImages] = useState<string[]>(
        initialData?.media.imageUrl ? [initialData.media.imageUrl] : []
    );
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>(
        fields?.["media.imageUrl"] || initialData?.media.imageUrl || ""
    );

    const val = (name: string, fallback?: string) => fields?.[name] ?? fallback ?? "";
    const err = (name: string) => fieldErrors?.[name]?.[0];

    const getRefId = (ref: SliderBanner["product"] | SliderBanner["brand"] | SliderBanner["category"]) => {
        if (!ref) return "";
        return typeof ref === "string" ? ref : (ref as { _id: string })._id ?? "";
    };

    const currentReferenceId = fields?.referenceId || getRefId(initialData?.product) || getRefId(initialData?.brand) || getRefId(initialData?.category);

    const handleUploadSuccess = (newImages: string[]) => {
        setAvailableImages(prev => [...prev, ...newImages]);
    };

    const handleConfirmSelection = (selectedImages: string[]) => {
        if (selectedImages.length > 0) {
            const selectedUrl = selectedImages[0];
            setSelectedImageUrl(selectedUrl);

            const imageInput = document.querySelector('input[name="media.imageUrl"]') as HTMLInputElement;
            if (imageInput) {
                imageInput.value = selectedUrl;
                imageInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-foreground">Tipo de Contenido</Label>
                            <Select name="contentType" defaultValue={val("contentType", initialData?.contentType ?? "product")}>
                                <SelectTrigger className={`h-10 text-xs bg-background-secondary border ${err("contentType") ? "border-destructive" : "border-border/40"} rounded-sm`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border border-border rounded-sm">
                                    {SliderContentTypeEnum.options.map((opt) => (
                                        <SelectItem key={opt} value={opt} className="text-xs uppercase font-medium">{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <ProductReferenceSelector
                                name="referenceId"
                                initialId={currentReferenceId}
                                initialProduct={
                                    initialData?.product &&
                                        typeof initialData.product === "object" &&
                                        "_id" in initialData.product
                                        ? {
                                            _id: initialData.product._id,
                                            nombre: initialData.product.nombre,
                                            precio: initialData.product.precio,
                                            imagenes: initialData.product.imagenes,
                                        }
                                        : null
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="title" label="Título Principal" tooltip="Texto principal del banner." />
                        <Input name="title" defaultValue={val("title", initialData?.title)} className={`h-10 text-xs bg-background-secondary border ${err("title") ? "border-destructive" : "border-border/40"} rounded-sm`} />
                        {err("title") && <p className="text-[10px] text-destructive">{err("title")}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="subtitle" label="Subtítulo" tooltip="Texto secundario opcional." />
                            <Input name="subtitle" defaultValue={val("subtitle", initialData?.subtitle)} className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="destUrl" label="URL de Destino" tooltip="Enlace al hacer clic." />
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-muted-foreground" />
                                <Input name="destUrl" className={`h-10 text-xs bg-background-secondary border ${err("destUrl") ? "border-destructive" : "border-border/40"} rounded-sm pl-9`} defaultValue={val("destUrl", initialData?.destUrl)} placeholder="/productos/slug..." />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="description" label="Descripción Corta" tooltip="Breve resumen informativo." />
                        <Textarea name="description" defaultValue={val("description", initialData?.description)} rows={2} className="text-xs bg-background-secondary border-border/40 rounded-sm" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <CardTitle>Multimedia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <input type="hidden" name="media.imageUrl" value={selectedImageUrl} />

                    <div className=" items-end gap-3 p-3 border border-border/40 bg-background-secondary/20 rounded-sm flex justify-between">
                        <div className="flex-1 space-y-1">
                            <Label className="text-xs font-bold text-foreground ">URL Imagen</Label>
                            <div className="h-10 px-3 flex items-center bg-background border border-border/40 rounded-sm text-xs text-muted-foreground truncate  max-w-lg">
                                {selectedImageUrl || "Sin imagen seleccionada"}
                            </div>
                        </div>
                        <MediaLibraryDialog
                            selectedImages={selectedImageUrl ? [selectedImageUrl] : []}
                            globalImagesPool={availableImages}
                            onConfirmSelection={handleConfirmSelection}
                            onUploadSuccess={handleUploadSuccess}
                            allowMultiple={false}
                            triggerLabel="Seleccionar"
                            triggerVariant="outline"
                            size="sm"
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip htmlFor="media.altText" label="Texto Alternativo (Alt)" tooltip="Descripción para accesibilidad." />
                        <Input name="media.altText" defaultValue={val("media.altText", initialData?.media.altText)} className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="media.videoUrl" label="URL Video" tooltip="URL para video opcional." />
                            <Input name="media.videoUrl" defaultValue={val("media.videoUrl", initialData?.media.videoUrl)} className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm" placeholder="https://..." />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="media.videoPoster" label="Poster del Video" tooltip="Miniatura para el video." />
                            <Input name="media.videoPoster" defaultValue={val("media.videoPoster", initialData?.media.videoPoster)} className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-foreground">Object Fit</Label>
                            <Select name="media.objectFit" defaultValue={val("media.objectFit", initialData?.media.objectFit ?? "cover")}>
                                <SelectTrigger className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-background border border-border rounded-sm">
                                    {SliderObjectFitEnum.options.map((opt) => <SelectItem key={opt} value={opt} className="text-xs uppercase">{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-foreground">Borde Imagen</Label>
                            <Select name="media.border" defaultValue={val("media.border", initialData?.media.border ?? "none")}>
                                <SelectTrigger className="h-10 text-xs bg-background-secondary border-border/40 rounded-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-background border border-border rounded-sm">
                                    {SliderBorderStyleEnum.options.map((opt) => <SelectItem key={opt} value={opt} className="text-xs uppercase">{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}