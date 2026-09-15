// File: frontend/components/home/product/ProductExpandableSections.tsx
"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import { Package, Ruler } from "lucide-react";
import { H3, Small } from "@/components/ui/TypographyV3";

type Props = {
    producto: ProductWithCategoryResponse;
};

function cleanHtmlContent(html: string): string {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/gi, "")
        .replace(/\s+/g, "")
        .trim();
}

export default function ProductExpandableSections({ producto }: Props) {
    const descripcionRaw = producto.descripcion ?? "";
    const specsArray = producto.especificaciones ?? [];

    const hasWeight = Boolean(producto.weight);
    const hasDimensions = Boolean(
        producto.dimensions?.length ||
        producto.dimensions?.width ||
        producto.dimensions?.height
    );
    const hasPhysicalData = hasWeight || hasDimensions;

    const hasDescripcion = cleanHtmlContent(descripcionRaw).length > 0;
    const hasSpecs = specsArray.length > 0 || hasPhysicalData;

    if (!hasDescripcion && !hasSpecs) return null;

    return (
        <Accordion type="multiple" className="w-full divide-y divide-border-primary/70 border-b border-border-primary/70">
            {/* DESCRIPCIÓN */}
            {hasDescripcion && (
                <AccordionItem value="descripcion" className="border-none">
                    <AccordionTrigger className="py-3.5 outline-none hover:no-underline">
                        <H3 className="text-sm font-semibold tracking-tight text-text-primary">
                            Información del producto
                        </H3>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-1">
                        <div
                            className="prose prose-xs max-w-none text-text-secondary leading-relaxed sm:prose-sm prose-headings:font-semibold prose-headings:text-text-primary prose-strong:text-text-primary prose-a:text-brand-accent prose-a:no-underline hover:prose-a:underline"
                            dangerouslySetInnerHTML={{ __html: descripcionRaw }}
                        />
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* ESPECIFICACIONES TÉCNICAS */}
            {hasSpecs && (
                <AccordionItem value="specs" className="border-none">
                    <AccordionTrigger className="py-3.5 outline-none hover:no-underline">
                        <H3 className="text-sm font-semibold tracking-tight text-text-primary">
                            Especificaciones técnicas
                        </H3>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-5 pt-1">
                        {specsArray.length > 0 && (
                            <div className="w-full overflow-hidden rounded-radius-md border border-border-primary/80 bg-surface-primary">
                                <table className="w-full border-collapse text-left">
                                    <tbody className="divide-y divide-border-primary/70">
                                        {specsArray.map((spec) => (
                                            <tr key={spec.key} className="transition-colors duration-fast hover:bg-surface-secondary/40">
                                                <td className="w-[38%] border-r border-border-primary/70 bg-surface-secondary/40 px-3 py-2 text-xs font-medium text-text-secondary select-none">
                                                    {spec.key}
                                                </td>
                                                <td className="px-3 py-2 text-xs font-normal text-text-primary break-words">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {hasPhysicalData && (
                            <div className="w-full overflow-hidden rounded-radius-md border border-border-primary/80 bg-surface-primary">
                                <table className="w-full border-collapse text-left">
                                    <thead>
                                        <tr>
                                            <th colSpan={2} className="border-b border-border-primary/70 bg-surface-secondary/60 px-3 py-2 select-none">
                                                <div className="flex items-center gap-1.5">
                                                    <Package size={13} className="text-text-tertiary" />
                                                    <Small className="text-[10px] font-semibold uppercase   text-text-tertiary">
                                                        Empaque y dimensiones
                                                    </Small>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-primary/70">
                                        {hasWeight && (
                                            <tr className="transition-colors duration-fast hover:bg-surface-secondary/40">
                                                <td className="w-[38%] border-r border-border-primary/70 bg-surface-secondary/40 px-3 py-2 text-xs font-medium text-text-secondary select-none">
                                                    Peso estimado
                                                </td>
                                                <td className="px-3 py-2 text-xs font-normal text-text-primary">
                                                    {producto.weight} kg
                                                </td>
                                            </tr>
                                        )}
                                        {hasDimensions && (
                                            <tr className="transition-colors duration-fast hover:bg-surface-secondary/40">
                                                <td className="w-[38%] border-r border-border-primary/70 bg-surface-secondary/40 px-3 py-2 text-xs font-medium text-text-secondary select-none">
                                                    <div className="flex items-center gap-1.5">
                                                        <Ruler size={12} className="text-text-tertiary" />
                                                        <span>Dimensiones</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-xs font-normal text-text-primary">
                                                    {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height}{" "}
                                                    <span className="text-[11px] text-text-tertiary">cm</span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            )}
        </Accordion>
    );
}