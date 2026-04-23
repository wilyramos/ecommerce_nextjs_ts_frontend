"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import type { TApiProduct } from "@/src/schemas";
import { Textarea } from "@/components/ui/textarea"

interface SEOProductProps {
    product?: TApiProduct;
}

export default function SEOProduct({ product }: SEOProductProps) {
    const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
    const [metaDescription, setMetaDescription] = useState(product?.metaDescription ?? "");

    const titleLen = metaTitle.length;
    const descLen = metaDescription.length;

    // Adaptando lógica de colores a la paleta de la marca
    const titleColor =
        titleLen === 0 ? "text-[var(--color-text-tertiary)]"
            : titleLen <= 60 ? "text-emerald-600"
                : "text-[var(--color-accent-warm)]"; // Uso del acento para errores/excesos

    const descColor =
        descLen === 0 ? "text-[var(--color-text-tertiary)]"
            : descLen <= 160 ? "text-emerald-600"
                : "text-[var(--color-accent-warm)]";

    return (
        <div className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-6 mt-4">
            
            {/* Header con estilo de Novedades */}
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--color-accent-warm)]">
                    <Search className="w-3.5 h-3.5 text-[var(--color-text-inverse)]" />
                </div>
                <Label className="text-[10px] font-bold  tracking-[0.2em] text-[var(--color-text-primary)]">
                    Configuración SEO
                </Label>
            </div>

            {/* Preview Google - Simulación minimalista */}
            <div className="border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] p-4 space-y-1.5">
                <p className="text-[9px] font-bold text-[var(--color-text-tertiary)] mb-2">
                    Vista previa en buscadores
                </p>
                <p className="text-[#1a0dab] text-lg font-medium truncate leading-tight hover:underline cursor-pointer">
                    {metaTitle || product?.nombre || "Título del producto | GoPhone"}
                </p>
                <p className="text-[#006621] text-xs flex items-center gap-1">
                    https://gophone.pe <span className="text-[var(--color-text-tertiary)] text-[10px]">›</span> {product?.slug ?? "producto"}
                </p>
                <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
                    {metaDescription || product?.descripcion?.replace(/<[^>]*>/g, "") || "Optimiza tu presencia en Google con una descripción atractiva..."}
                </p>
            </div>

            <div className="grid gap-6">
                {/* Meta Title */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <LabelWithTooltip
                            htmlFor="metaTitle"
                            label="Meta Title"
                            tooltip="Título optimizado para SEO (60 caracteres recomendados)."
                        />
                        <span className={`text-[10px] font-bold tracking-tighter ${titleColor}`}>
                            {titleLen} / 60
                        </span>
                    </div>
                    <Input
                        id="metaTitle"
                        name="metaTitle"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        maxLength={70}
                        placeholder={product?.nombre ?? "Ej: producto abc | GoPhone"}
                    />
                </div>

                {/* Meta Description */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <LabelWithTooltip
                            htmlFor="metaDescription"
                            label="Meta Description"
                            tooltip="Resumen que atrae clics. Máximo 160 caracteres."
                        />
                        <span className={`text-[10px] font-bold tracking-tighter ${descColor}`}>
                            {descLen} / 160
                        </span>
                    </div>
                    <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        maxLength={180}
                        rows={3}
                        placeholder="Describe el producto incluyendo palabras clave relevantes..."
                    />
                </div>
            </div>

            {/* Nota Informativa */}
            <div className="pt-2 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[var(--color-accent-warm)] mt-1.5 shrink-0" />
                <p className="text-[11px] text-[var(--color-text-tertiary)] italic">
                    Si se dejan vacíos, el sistema generará automáticamente los metadatos basados en el nombre y la descripción general del producto.
                </p>
            </div>
        </div>
    );
}