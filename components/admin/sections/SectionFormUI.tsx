"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type {
    SectionResponse,
    SectionType,
    SectionBlock,
    VideoAspectRatio,
} from "@/src/schemas/section.schema";
import { SECTION_TYPE_LABELS } from "@/src/schemas/section.schema";
import type { FormActionState } from "@/actions/section-action";
import { Plus, Trash2, Save, AlertCircle, Info, Edit2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMediaField } from "@/components/form/FormMediaField";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

/**
 * Estado local de un bloque de contenido
 */
interface LocalBlockState {
    title: string;
    subtitle: string;
    imageUrl: string;
    videoUrl: string;
    aspectRatio: VideoAspectRatio;
    linkTo: string;
    productId: string;
}

/**
 * Props del componente SectionFormUI
 */
interface SectionFormUIProps {
    formAction: (payload: FormData) => void | Promise<void>;
    state: FormActionState;
    isPending: boolean;
    initialData?: SectionResponse;
    titleLabel: string;
}

/**
 * Descripciones de tipos de sección
 */
const SECTION_TYPE_DESCRIPTIONS: Readonly<Record<SectionType, string>> = {
    featured_collections: "Bloques multimedia con soporte de imagen o video con enlace. Ideal para destacar categorías o campañas visuales.",
    product_grid: "Cuadrícula de productos vinculados por ID. Requiere al menos un bloque con productId, imagen o video.",
    rich_text: "Contenido editorial libre. No utiliza bloques; usa el campo de cuerpo de texto.",
};

/**
 * Mapeo de aspect ratios a clases de Tailwind
 */
const ASPECT_RATIO_CLASSES: Readonly<Record<VideoAspectRatio, string>> = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
};

/**
 * Componente de indicador "Requerido"
 */
function Required(): ReactNode {
    return <span className="text-destructive ml-0.5">*</span>;
}

/**
 * Componente genérico para campos de formulario
 */
function Field({
    label,
    required,
    error,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
}): ReactNode {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
                {label}
                {required && <Required />}
            </label>
            {children}
            {hint && !error && (
                <p className="text-xs text-muted-foreground">{hint}</p>
            )}
            {error && (
                <p className="flex items-center gap-1 text-xs text-destructive font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

/**
 * Componente de vista previa de bloque multimedia
 */
function BlockPreview({
    block,
    isError,
}: {
    block: LocalBlockState;
    isError?: boolean;
}): ReactNode {
    const aspectClass = ASPECT_RATIO_CLASSES[block.aspectRatio as VideoAspectRatio] || "aspect-video";
    const hasMedia = Boolean(block.imageUrl || block.videoUrl);

    return (
        <div
            className={`relative bg-gradient-to-b from-muted/30 to-muted/10 border rounded-lg overflow-hidden group transition-colors ${
                isError ? "border-destructive/60 bg-destructive/5" : "border-border"
            } ${aspectClass}`}
        >
            {hasMedia ? (
                <>
                    {block.imageUrl ? (
                        <Image
                            src={block.imageUrl}
                            alt={block.title || "Vista previa"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={false}
                        />
                    ) : null}
                    {block.videoUrl && !block.imageUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted/20">
                            <VideoIcon className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                    ) : null}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    <span className="text-xs text-muted-foreground/50">Sin media</span>
                </div>
            )}

            {/* Overlay con información del bloque */}
            {hasMedia && (block.title || block.subtitle) ? (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <div className="space-y-1">
                        {block.title && (
                            <p className="text-sm font-semibold text-white line-clamp-2">
                                {block.title}
                            </p>
                        )}
                        {block.subtitle && (
                            <p className="text-xs text-white/80 line-clamp-1">
                                {block.subtitle}
                            </p>
                        )}
                    </div>
                </div>
            ) : null}

            {/* Indicador de edición en hover */}
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-4 h-4 text-white" />
            </div>

            {/* Indicador de error */}
            {isError ? (
                <div className="absolute inset-0 border-2 border-destructive rounded-lg bg-destructive/5 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
            ) : null}
        </div>
    );
}

/**
 * Obtiene las clases de grid dinámicamente según el número de columnas
 */
function getGridClasses(columns: number): string {
    switch (Math.min(Math.max(columns, 1), 8)) {
        case 1:
            return "grid-cols-1";
        case 2:
            return "grid-cols-1 sm:grid-cols-2";
        case 3:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
        case 4:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
        case 5:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
        case 6:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
        case 7:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7";
        case 8:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8";
        default:
            return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    }
}

/**
 * Convierte un ProductId a string
 */
function resolveProductId(productId: unknown): string {
    if (!productId) return "";
    if (typeof productId === "string") return productId;
    if (typeof productId === "object" && productId !== null && "_id" in productId) {
        return String((productId as Record<string, unknown>)._id || "");
    }
    return "";
}

/**
 * Resuelve los bloques desde el estado enviado o datos iniciales
 */
function resolveBlocks(
    submitted: unknown,
    initialData: SectionResponse | undefined
): LocalBlockState[] {
    const source = (submitted as { blocks?: SectionBlock[] } | null | undefined)?.blocks ?? initialData?.blocks;

    if (!Array.isArray(source)) return [];

    return source.map((block): LocalBlockState => ({
        title: String(block?.title ?? ""),
        subtitle: String(block?.subtitle ?? ""),
        imageUrl: String(block?.imageUrl ?? ""),
        videoUrl: String(block?.videoUrl ?? ""),
        aspectRatio: (block?.aspectRatio as VideoAspectRatio) ?? "16:9",
        linkTo: String(block?.linkTo ?? ""),
        productId: resolveProductId(block?.productId),
    }));
}

/**
 * Componente principal del formulario de secciones
 */
export default function SectionFormUI({
    formAction,
    state,
    isPending,
    initialData,
}: SectionFormUIProps) {
    const isEditMode = Boolean(initialData);
    const submitted = state?.submitted as unknown;

    // Estados principales
    const [blocks, setBlocks] = useState<LocalBlockState[]>(() =>
        resolveBlocks(submitted, initialData)
    );
    const [sectionType, setSectionType] = useState<SectionType>(() => {
        const submittedType = submitted as { type?: SectionType } | null | undefined;
        return (submittedType?.type ?? (initialData?.type as SectionType) ?? "product_grid");
    });
    const [isActive, setIsActive] = useState<boolean>(() => {
        const submittedActive = submitted as { isActive?: boolean } | null | undefined;
        return submittedActive?.isActive !== undefined
            ? Boolean(submittedActive.isActive)
            : (initialData?.isActive ?? true);
    });
    const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);

    // Refs para manejo de errores
    const errorCountRef = useRef(0);
    const [formKey, setFormKey] = useState(0);

    // Efecto para sincronizar estado cuando hay errores de validación
    useEffect(() => {
        if (state?.fields && !state.ok) {
            errorCountRef.current += 1;
            setFormKey(errorCountRef.current);
            setBlocks(resolveBlocks(submitted, initialData));
            setSectionType(
                (submitted as { type?: SectionType } | null | undefined)?.type ??
                (initialData?.type as SectionType) ??
                "product_grid"
            );
            setIsActive(
                (submitted as { isActive?: boolean } | null | undefined)?.isActive !== undefined
                    ? Boolean((submitted as { isActive?: boolean } | null | undefined)?.isActive)
                    : (initialData?.isActive ?? true)
            );
        }
    }, [state, submitted, initialData]);

    // Callbacks optimizados
    const handleAddBlock = useCallback(() => {
        setBlocks((prev) => {
            if (prev.length >= 8) return prev;
            return [
                ...prev,
                {
                    title: "",
                    subtitle: "",
                    imageUrl: "",
                    videoUrl: "",
                    aspectRatio: "16:9",
                    linkTo: "",
                    productId: "",
                },
            ];
        });
        setExpandedBlockIndex(blocks.length);
    }, [blocks.length]);

    const handleRemoveBlock = useCallback((index: number) => {
        setBlocks((prev) => prev.filter((_, idx) => idx !== index));
        setExpandedBlockIndex(null);
    }, []);

    const handleBlockChange = useCallback(
        (index: number, field: keyof LocalBlockState, value: string) => {
            setBlocks((prev) => {
                const updated = [...prev];
                if (updated[index]) {
                    updated[index] = {
                        ...updated[index],
                        [field]: value,
                    };
                }
                return updated;
            });
        },
        []
    );

    // Valores resueltos
    const resolvedTitle = (submitted as { title?: string } | null | undefined)?.title ?? initialData?.title ?? "";
    const resolvedGridColumns = Math.min(
        Math.max(
            (submitted as { settings?: { gridColumns?: number } } | null | undefined)?.settings?.gridColumns ??
            initialData?.settings?.gridColumns ??
            4,
            1
        ),
        8
    );
    const resolvedBodyText =
        (submitted as { settings?: { bodyText?: string } } | null | undefined)?.settings?.bodyText ?? initialData?.settings?.bodyText ?? "";
    const resolvedOrder =
        (submitted as { order?: number } | null | undefined)?.order ?? initialData?.order ?? 0;

    // Computados
    const hasErrors = useMemo(
        () => Boolean(state?.fields && Object.keys(state.fields).length > 0),
        [state?.fields]
    );
    const isMaxBlocksReached = blocks.length >= 8;

    const gridClasses = useMemo(() => getGridClasses(resolvedGridColumns), [resolvedGridColumns]);

    const expandedBlock = useMemo(
        () => (expandedBlockIndex !== null ? blocks[expandedBlockIndex] : null),
        [blocks, expandedBlockIndex]
    );

    const blockErrors = useMemo(() => {
        const errors: Record<number, string | undefined> = {};
        if (state?.fields) {
            for (let i = 0; i < blocks.length; i++) {
                const error = (state.fields as Record<string, unknown>)[`blocks.${i}`];
                if (error) errors[i] = String(error);
            }
        }
        return errors;
    }, [state?.fields, blocks.length]);

    return (
        <form
            key={formKey}
            action={formAction}
            className="space-y-6 max-w-7xl mx-auto text-foreground"
        >
            {/* Hidden inputs para datos del formulario */}
            <input type="hidden" name="blocksData" value={JSON.stringify(blocks)} />
            <input type="hidden" name="isActive" value={String(isActive)} />

            {/* Banner de errores globales */}
            {hasErrors && (
                <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-destructive">
                            {state?.error ?? "Hay campos con errores"}
                        </p>
                        <p className="text-xs text-destructive/80 mt-0.5">
                            Revisa los campos marcados a continuación y vuelve a intentarlo.
                        </p>
                    </div>
                </div>
            )}

            {/* Barra superior de acciones */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end">
                
                <Button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 font-semibold shrink-0"
                >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {isPending ? "Procesando..." : isEditMode ? "Guardar Cambios" : "Crear Sección"}
                    </span>
                    <span className="sm:hidden">
                        {isPending ? "..." : isEditMode ? "Guardar" : "Crear"}
                    </span>
                </Button>
            </div>

            {/* Layout principal: 3 columnas en desktop, 1 en mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Columna principal (3/4) */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Card: Identificación */}
                    <Card className="rounded-xl border-border">
                        <CardHeader className="py-4 border-b border-border mb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Identificación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Field
                                label="Título Interno"
                                required
                                error={state?.fields?.title as string | undefined}
                                hint="Nombre de referencia para el panel de administración. No se muestra en la tienda pública."
                            >
                                <Input
                                    name="title"
                                    defaultValue={resolvedTitle}
                                    disabled={isPending}
                                    placeholder="Ej: Categorías populares — Verano 2026"
                                    className={
                                        state?.fields?.title
                                            ? "border-destructive/60 focus-visible:ring-destructive"
                                            : ""
                                    }
                                    aria-invalid={Boolean(state?.fields?.title)}
                                />
                            </Field>

                            <div className="flex items-start gap-2.5 bg-muted/30 border border-border rounded-lg px-3.5 py-3">
                                <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="text-xs text-muted-foreground leading-relaxed">
                                    {isEditMode ? (
                                        <p>
                                            El slug{" "}
                                            <code className="font-mono font-semibold text-foreground bg-muted px-1 py-0.5 rounded inline-block">
                                                {initialData?.slug}
                                            </code>
                                            {" "}es inmutable tras la creación.
                                        </p>
                                    ) : (
                                        <p>El slug identificador se genera automáticamente en el servidor a partir del título escrito (kebab-case).</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card: Configuración Estructural */}
                    <Card className="rounded-xl border-border">
                        <CardHeader className="py-4 border-b border-border mb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Configuración Estructural
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Field
                                    label="Tipo de Sección"
                                    required
                                    error={state?.fields?.type as string | undefined}
                                    hint={SECTION_TYPE_DESCRIPTIONS[sectionType]}
                                >
                                    {isEditMode && (
                                        <input type="hidden" name="type" value={sectionType} />
                                    )}

                                    <Select
                                        value={sectionType}
                                        disabled={isEditMode || isPending}
                                        onValueChange={(val) => setSectionType(val as SectionType)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {!isEditMode && (
                                        <input type="hidden" name="type" value={sectionType} />
                                    )}
                                </Field>

                                {sectionType !== "rich_text" && (
                                    <Field
                                        label="Columnas en Grilla"
                                        error={
                                            state?.fields?.["settings.gridColumns"] as string | undefined
                                        }
                                        hint="Visualización en pantallas de escritorio (1-8 columnas)."
                                    >
                                        <Input
                                            type="number"
                                            name="settings.gridColumns"
                                            defaultValue={resolvedGridColumns}
                                            disabled={isPending}
                                            min={1}
                                            max={8}
                                            aria-invalid={Boolean(
                                                state?.fields?.["settings.gridColumns"]
                                            )}
                                        />
                                    </Field>
                                )}
                            </div>

                            {sectionType === "rich_text" && (
                                <Field
                                    label="Cuerpo de Texto / HTML"
                                    required
                                    error={state?.fields?.["settings.bodyText"] as string | undefined}
                                    hint="Acepta texto plano o marcado HTML estructurado. Se renderizará directamente en la storefront."
                                >
                                    <Textarea
                                        name="settings.bodyText"
                                        defaultValue={resolvedBodyText}
                                        disabled={isPending}
                                        rows={6}
                                        placeholder="<p>Contenido editorial estructurado...</p>"
                                        className={`font-mono text-xs ${
                                            state?.fields?.["settings.bodyText"]
                                                ? "border-destructive/60 focus-visible:ring-destructive"
                                                : ""
                                        }`}
                                        aria-invalid={Boolean(state?.fields?.["settings.bodyText"])}
                                    />
                                </Field>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card: Grilla de Bloques Multimedia */}
                    {sectionType !== "rich_text" && (
                        <Card className="rounded-xl border-border">
                            <CardHeader className="py-4 border-b border-border mb-4 flex flex-row items-start sm:items-center justify-between gap-4 space-y-0">
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Bloques de Contenido
                                    </CardTitle>
                                    {blocks.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                            {blocks.length} de 8 bloques • Grilla con {resolvedGridColumns} columnas
                                        </p>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isMaxBlocksReached || isPending}
                                    onClick={handleAddBlock}
                                    className="flex items-center gap-1.5 text-xs h-8 font-semibold shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Añadir bloque</span>
                                    <span className="sm:hidden">Añadir</span>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Alerta de errores de bloques */}
                                {state?.fields?.blocks && (
                                    <div className="flex items-center gap-1 text-xs text-destructive font-medium bg-destructive/5 p-2 rounded border border-destructive/20 animate-in fade-in">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        {state.fields.blocks as string}
                                    </div>
                                )}

                                {/* Alerta de límite máximo */}
                                {isMaxBlocksReached && (
                                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-lg text-xs font-medium animate-in fade-in">
                                        <Info className="w-4 h-4 shrink-0" />
                                        <span>Límite máximo de 8 bloques alcanzado.</span>
                                    </div>
                                )}

                                {/* Estado vacío */}
                                {blocks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-border rounded-lg bg-muted/5">
                                        <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                Sin bloques de contenido
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Crea tu primer bloque para comenzar
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="default"
                                            size="sm"
                                            disabled={isPending}
                                            onClick={handleAddBlock}
                                            className="mt-2"
                                        >
                                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                                            Crear primer bloque
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Grilla de vista previa */}
                                        <div className={`grid gap-4 ${gridClasses}`}>
                                            {blocks.map((block, index) => (
                                                <button
                                                    key={`block-${index}`}
                                                    type="button"
                                                    onClick={() =>
                                                        setExpandedBlockIndex(
                                                            expandedBlockIndex === index ? null : index
                                                        )
                                                    }
                                                    className="group relative text-left transition-all hover:ring-2 hover:ring-primary/50 rounded-lg"
                                                    aria-pressed={expandedBlockIndex === index}
                                                    aria-label={`Editar bloque ${index + 1}`}
                                                >
                                                    <BlockPreview
                                                        block={block}
                                                        isError={Boolean(blockErrors[index])}
                                                    />
                                                </button>
                                            ))}
                                        </div>

                                        {/* Panel de edición expandido */}
                                        {expandedBlock !== null && expandedBlockIndex !== null && (
                                            <div className="border-t border-border pt-6 mt-6 animate-in fade-in slide-in-from-bottom-4">
                                                <div className="space-y-4">
                                                    {/* Header del panel */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="space-y-0.5">
                                                            <h4 className="text-sm font-bold">
                                                                Bloque #{expandedBlockIndex + 1}
                                                            </h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                Edita los detalles de este bloque
                                                            </p>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            disabled={isPending}
                                                            onClick={() =>
                                                                handleRemoveBlock(expandedBlockIndex)
                                                            }
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                                                            aria-label="Eliminar bloque"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Campos de edición */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {/* Multimedia (2 columnas) */}
                                                        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase text-muted-foreground">
                                                                    Imagen Miniatura
                                                                </label>
                                                                <FormMediaField
                                                                    name={`block_image_${expandedBlockIndex}`}
                                                                    folder="general"
                                                                    defaultValue={expandedBlock.imageUrl}
                                                                    multiple={false}
                                                                    maxFiles={1}
                                                                    accept="image"
                                                                    onChange={(urls: string[]) =>
                                                                        handleBlockChange(
                                                                            expandedBlockIndex,
                                                                            "imageUrl",
                                                                            urls[0] ?? ""
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold uppercase text-muted-foreground">
                                                                    Video de Campaña
                                                                </label>
                                                                <FormMediaField
                                                                    name={`block_video_${expandedBlockIndex}`}
                                                                    folder="general"
                                                                    defaultValue={expandedBlock.videoUrl}
                                                                    multiple={false}
                                                                    maxFiles={1}
                                                                    accept="video"
                                                                    onChange={(urls: string[]) =>
                                                                        handleBlockChange(
                                                                            expandedBlockIndex,
                                                                            "videoUrl",
                                                                            urls[0] ?? ""
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Título */}
                                                        <Input
                                                            value={expandedBlock.title}
                                                            disabled={isPending}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                                handleBlockChange(
                                                                    expandedBlockIndex,
                                                                    "title",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Título descriptivo"
                                                            className="text-sm"
                                                            maxLength={100}
                                                        />

                                                        {/* Subtítulo */}
                                                        <Input
                                                            value={expandedBlock.subtitle}
                                                            disabled={isPending}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                                handleBlockChange(
                                                                    expandedBlockIndex,
                                                                    "subtitle",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Subtítulo o descripción"
                                                            className="text-sm"
                                                            maxLength={100}
                                                        />

                                                        {/* Link */}
                                                        <Input
                                                            value={expandedBlock.linkTo}
                                                            disabled={isPending}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                                handleBlockChange(
                                                                    expandedBlockIndex,
                                                                    "linkTo",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Ruta destino (Ej: /shop/offers)"
                                                            className="text-sm"
                                                        />

                                                        {/* Aspect Ratio */}
                                                        <Select
                                                            value={expandedBlock.aspectRatio}
                                                            disabled={isPending}
                                                            onValueChange={(val) =>
                                                                handleBlockChange(
                                                                    expandedBlockIndex,
                                                                    "aspectRatio",
                                                                    val
                                                                )
                                                            }
                                                        >
                                                            <SelectTrigger className="text-sm">
                                                                <SelectValue placeholder="Aspecto" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="16:9">
                                                                    Landscape (16:9)
                                                                </SelectItem>
                                                                <SelectItem value="9:16">
                                                                    Vertical (9:16)
                                                                </SelectItem>
                                                                <SelectItem value="1:1">
                                                                    Cuadrado (1:1)
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>

                                                        {/* Product ID */}
                                                        <Input
                                                            value={expandedBlock.productId}
                                                            disabled={isPending}
                                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                                handleBlockChange(
                                                                    expandedBlockIndex,
                                                                    "productId",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={
                                                                sectionType === "product_grid"
                                                                    ? "ObjectId obligatorio"
                                                                    : "ID producto (opcional)"
                                                            }
                                                            className="text-sm font-mono"
                                                            maxLength={24}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Columna lateral (1/4) */}
                <div className="lg:col-span-1 space-y-6 h-fit">

                    {/* Card: Publicación */}
                    <Card className="rounded-xl border-border">
                        <CardHeader className="py-4 border-b border-border mb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Publicación
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg px-3.5 py-3 border border-border bg-muted/10">
                                <div className="space-y-0.5 flex-1">
                                    <p className="text-sm font-semibold text-foreground">
                                        {isActive ? "Visible" : "Oculta"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">En tienda</p>
                                </div>
                                <Switch
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                    disabled={isPending}
                                    aria-label="Cambiar visibilidad en tienda"
                                />
                            </div>

                            <Field
                                label="Orden de Prioridad"
                                error={state?.fields?.order as string | undefined}
                                hint="Número menor = aparece primero"
                            >
                                <Input
                                    type="number"
                                    name="order"
                                    defaultValue={resolvedOrder}
                                    disabled={isPending}
                                    min={0}
                                    max={999}
                                    aria-invalid={Boolean(state?.fields?.order)}
                                />
                            </Field>
                        </CardContent>
                    </Card>

                    {/* Card: Información (solo en edición) */}
                    {isEditMode && initialData && (
                        <Card className="rounded-xl border-border bg-muted/30">
                            <CardHeader className="py-4 border-b border-border mb-3">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Información
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-xs">
                                <div className="space-y-1">
                                    <span className="text-muted-foreground text-[11px] uppercase font-semibold">
                                        Slug:
                                    </span>
                                    <code className="text-foreground bg-background px-2 py-1.5 rounded border border-border/50 block break-all text-[11px] font-mono">
                                        {initialData.slug}
                                    </code>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-muted-foreground text-[11px] uppercase font-semibold">
                                        Bloques Activos:
                                    </span>
                                    <p className="text-foreground font-semibold">
                                        {blocks.length} / 8
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </form>
    );
}