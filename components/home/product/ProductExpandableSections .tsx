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
import { H3, Small } from "@/components/ui/TypographyStore";

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
        <Accordion type="multiple" className="w-full divide-y divide-border border-b border-border px-4">
            {/* DESCRIPCIÓN */}
            {hasDescripcion && (
                <AccordionItem value="descripcion" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3 outline-none">
                        <H3>Información del producto</H3>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-1">
                        <div
                            className="prose prose-sm max-w-none text-foreground/90 leading-relaxed prose-headings:text-foreground prose-strong:text-foreground prose-a:text-foreground"
                            dangerouslySetInnerHTML={{ __html: descripcionRaw }}
                        />
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* ESPECIFICACIONES TÉCNICAS */}
            {hasSpecs && (
                <AccordionItem value="specs" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-3 outline-none">
                        <H3>Especificaciones</H3>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-1 space-y-3">
                        {specsArray.length > 0 && (
                            <div className="overflow-x-auto w-full border border-border">
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-border">
                                        {specsArray.map((spec) => (
                                            <tr key={spec.key} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium w-[35%] border-r border-border bg-muted/20 select-none">
                                                    {spec.key}
                                                </td>
                                                <td className="px-3 py-2 text-xs text-foreground font-normal break-words">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {hasPhysicalData && (
                            <div className="overflow-x-auto w-full border border-border">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr>
                                            <th colSpan={2} className="px-3 py-1.5 border-b border-border bg-muted/30 select-none">
                                                <div className="flex items-center gap-1.5">
                                                    <Package size={12} className="text-muted-foreground" />
                                                    <Small className="uppercase tracking-wider font-medium">Físico y embalaje</Small>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {hasWeight && (
                                            <tr className="hover:bg-muted/30 transition-colors">
                                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium w-[35%] border-r border-border bg-muted/20 select-none">
                                                    Peso
                                                </td>
                                                <td className="px-3 py-2 text-xs text-foreground font-normal">
                                                    {producto.weight} kg
                                                </td>
                                            </tr>
                                        )}
                                        {hasDimensions && (
                                            <tr className="hover:bg-muted/30 transition-colors">
                                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium border-r border-border bg-muted/20 select-none">
                                                    <div className="flex items-center gap-1.5">
                                                        <Ruler size={11} className="text-muted-foreground" />
                                                        <span>Dimensiones</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2 text-xs text-foreground font-normal">
                                                    {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height}{" "}
                                                    <Small className="font-normal">cm</Small>
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