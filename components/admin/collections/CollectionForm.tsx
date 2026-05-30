"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCollectionAction, updateCollectionAction } from "@/src/actions/collection-action";
import { Collection, COLLECTION_TYPES, CollectionType, HOMEPAGE_LAYOUT_TYPES, HomepageLayoutType } from "@/src/schemas/collection.schema";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Componente Unificado de Medios
import { FormMediaField } from "@/components/form/FormMediaField";

interface Props {
    collectionToEdit?: Collection;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    featured: "Destacados (Frontpage)",
    new_arrivals: "Nuevos Ingresos (Frontpage)",
    best_sellers: "Más Vendidos (Frontpage)",
    on_sale: "En Oferta (Frontpage)",
    promotion: "Promoción Comercial",
    theme: "Temática de Catálogo",
    editorial: "Editorial",
    seasonal: "Temporada (Campañas)",
};

const LAYOUT_TYPE_LABELS: Record<HomepageLayoutType, string> = {
    grid: "Cuadrícula estática (Grid)",
    carousel: "Cinta deslizable (Carousel)",
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
    const [showInHomepage, setShowInHomepage] = useState<boolean>(collectionToEdit?.showInHomepage ?? false);
    const [selectedLayout, setSelectedLayout] = useState<HomepageLayoutType>(collectionToEdit?.homepageLayout ?? "grid");

    const [color, setColor] = useState(collectionToEdit?.color ?? "#ffffff");
    const [badgeColor, setBadgeColor] = useState(collectionToEdit?.badgeColor ?? "#ff6000");

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

                {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
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
                                disabled={isPending || collectionToEdit?.isSystem}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Color hex</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    name="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    disabled={isPending}
                                    className="w-12 h-10 p-1 cursor-pointer shrink-0 border border-border bg-transparent"
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
                            <Label>Orden en Catálogo</Label>
                            <Input
                                type="text"
                                value={isEditing ? `# ${collectionToEdit?.order}` : "Se asignará automáticamente"}
                                readOnly
                                disabled
                                className="bg-muted-neutral text-muted-neutral-foreground font-semibold font-mono border-border select-none"
                            />
                            <p className="text-[11px] text-muted-foreground select-none">
                                Modifica este value arrastrando la colección en el listado general.
                            </p>
                        </div>
                    </div>
                </section>

                {/* SECCIÓN 2: MAQUETACIÓN DINÁMICA DEL HOMEPAGE (CMS) */}
                <section className="space-y-4 border border-border p-4 rounded-[var(--radius-lg)] bg-background-secondary">
                    <SectionTitle>Configuración en Página de Inicio</SectionTitle>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <Label htmlFor="showInHomepage" className="font-bold text-foreground">Mostrar sección en el Home</Label>
                            <p className="text-xs text-muted-foreground">Activa este bloque para pintar la colección en la portada del ecommerce</p>
                        </div>
                        <input type="hidden" name="showInHomepage" value={String(showInHomepage)} />
                        <Switch
                            id="showInHomepage"
                            checked={showInHomepage}
                            onCheckedChange={(checked) => setShowInHomepage(checked)}
                            disabled={isPending || collectionToEdit?.isSystem}
                        />
                    </div>

                    {showInHomepage && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border animate-in fade-in duration-200">
                            <div className="space-y-2">
                                <Label>Posición en Home</Label>
                                <Input
                                    type="text"
                                    value={isEditing ? `# ${collectionToEdit?.homepageOrder}` : "Se asignará al ordenar"}
                                    readOnly
                                    disabled
                                    className="bg-muted-neutral text-muted-neutral-foreground font-semibold font-mono border-border select-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Límite productos</Label>
                                <Input
                                    name="maxHomepageItems"
                                    type="number"
                                    min={1}
                                    max={50}
                                    defaultValue={collectionToEdit?.maxHomepageItems ?? 8}
                                    disabled={isPending}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Layout de la Sección</Label>
                                <input type="hidden" name="homepageLayout" value={selectedLayout} />
                                <Select
                                    value={selectedLayout}
                                    onValueChange={(v) => setSelectedLayout(v as HomepageLayoutType)}
                                    disabled={isPending}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Layout" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {HOMEPAGE_LAYOUT_TYPES.map((l) => (
                                            <SelectItem key={l} value={l}>
                                                {LAYOUT_TYPE_LABELS[l]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </section>

                {/* SECCIÓN 3: IMÁGENES REFACTORIZADA */}
                <section className="space-y-4">
                    <SectionTitle>Imágenes</SectionTitle>

                    <div className="space-y-1.5">
                        <FormMediaField
                            name="image"
                            label="Imagen destacada"
                            folder="general"
                            defaultValue={collectionToEdit?.image ?? undefined}
                            multiple={false}
                            maxFiles={1}
                            accept="image"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <FormMediaField
                            name="bannerImage"
                            label="Banner (landing de colección)"
                            folder="banners"
                            defaultValue={collectionToEdit?.bannerImage ?? undefined}
                            multiple={false}
                            maxFiles={1}
                            accept="image"
                        />
                    </div>
                </section>

                {/* SECCIÓN 4: CONFIGURACIÓN DE PROMOCIÓN TIMED */}
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
                                <Label>Etiqueta badge <span className="text-muted-foreground text-xs select-none">Ej: 20% OFF</span></Label>
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
                                        className="w-12 h-10 p-1 cursor-pointer shrink-0 border border-border bg-transparent"
                                    />
                                    <Input
                                        type="text"
                                        value={badgeColor}
                                        onChange={(e) => setBadgeColor(e.target.value)}
                                        placeholder="#ff6000"
                                        maxLength={7}
                                        disabled={isPending}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SECCIÓN 5: SEO */}
                <section className="space-y-4">
                    <SectionTitle>SEO</SectionTitle>

                    <div className="space-y-2">
                        <Label>Título SEO <span className="text-muted-foreground text-xs select-none">(máx. 60 caracteres)</span></Label>
                        <Input
                            name="seoTitle"
                            defaultValue={collectionToEdit?.seoTitle ?? ""}
                            maxLength={60}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción SEO <span className="text-muted-foreground text-xs select-none">(máx. 160 caracteres)</span></Label>
                        <Textarea
                            name="seoDescription"
                            defaultValue={collectionToEdit?.seoDescription ?? ""}
                            maxLength={160}
                            disabled={isPending}
                            rows={3}
                        />
                    </div>
                </section>

                {/* SECCIÓN 6: ESTADO OPERATIVO */}
                <section className="space-y-4">
                    <SectionTitle>Estado</SectionTitle>

                    <div className="flex items-center justify-between p-4 rounded-[var(--radius-lg)] border border-border bg-background-secondary">
                        <div>
                            <Label htmlFor="isActive" className="font-bold text-foreground">Colección activa</Label>
                            <p className="text-xs text-muted-foreground">Las colecciones inactivas no son visibles en el catálogo público</p>
                        </div>
                        <input type="hidden" name="isActive" value={String(collectionToEdit?.isActive ?? true)} />
                        <Switch
                            id="isActive"
                            defaultChecked={collectionToEdit?.isActive ?? true}
                            onCheckedChange={(checked) => {
                                const input = document.querySelector('input[name="isActive"]') as HTMLInputElement;
                                if (input) input.value = String(checked);
                            }}
                            disabled={isPending || collectionToEdit?.isSystem}
                        />
                    </div>
                </section>

                {state?.error && (
                    <p className="text-sm font-bold text-destructive select-none">{state.error}</p>
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
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-6"
                    >
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1 select-none">
            {children}
        </h2>
    );
}