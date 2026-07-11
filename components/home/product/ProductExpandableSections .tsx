// File: frontend/components/home/product/ProductExpandableSections.tsx
"use client";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import { getDeliveryRange } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, FileText, Package, Ruler } from "lucide-react";

type Props = {
    producto: ProductWithCategoryResponse;
};

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
    const hasDescripcion = descripcionRaw.trim().length > 0;
    const hasSpecs = specsArray.length > 0 || hasPhysicalData;

    if (!hasDescripcion && !hasSpecs) return null;

    const defaultOpen = hasDescripcion ? "descripcion" : "specs";

    return (
        <Accordion type="multiple" defaultValue={[defaultOpen]} className="w-full divide-y divide-border/40 border-b border-border/40 px-0.5">

            {/* DESCRIPCIÓN */}
            {hasDescripcion && (
                <AccordionItem value="descripcion" className="border-none">
                    <AccordionTrigger className="hover:no-underline group py-2.5 outline-none">
                        <span className="text-xs font-bold  text-foreground tracking-wider transition-colors group-hover:text-action-cta">
                            Información del producto
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-0.5">
                        <div
                            className="prose prose-sm max-w-none text-xs text-muted-foreground leading-relaxed prose-headings:text-foreground prose-headings:font-semibold prose-strong:text-foreground prose-strong:font-semibold prose-p:text-xs prose-p:leading-relaxed prose-a:text-action-cta"
                            dangerouslySetInnerHTML={{ __html: descripcionRaw }}
                        />
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* ESPECIFICACIONES */}
            {hasSpecs && (
                <AccordionItem value="specs" className="border-none">
                    <AccordionTrigger className="hover:no-underline group py-2.5 outline-none">
                        <span className="text-xs font-bold  text-foreground tracking-wider transition-colors group-hover:text-action-cta">
                            Especificaciones
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 pt-0.5 space-y-3">
                        {specsArray.length > 0 && (
                            <div className="overflow-x-auto w-full border border-border/60 rounded-xs">
                                <table className="w-full text-left border-collapse text-xs">
                                    <tbody className="divide-y divide-border/40">
                                        {specsArray.map((spec) => (
                                            <tr key={spec.key} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-2.5 py-2 text-[11px] text-muted-foreground font-semibold w-[35%] border-r border-border/40 bg-muted/10 select-none  tracking-tight">
                                                    {spec.key}
                                                </td>
                                                <td className="px-2.5 py-2 text-[11px] text-foreground font-medium break-words">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {hasPhysicalData && (
                            <div className="overflow-x-auto w-full border border-border/60 rounded-xs">
                                <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                        <tr>
                                            <th colSpan={2} className="px-2.5 py-1.5 text-[9px] font-bold  tracking-widest text-muted-foreground border-b border-border/40 bg-muted/20 select-none">
                                                <div className="flex items-center gap-1">
                                                    <Package size={11} className="text-muted-foreground/80" />
                                                    Físico y embalaje
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                        {hasWeight && (
                                            <tr className="hover:bg-muted/5 transition-colors">
                                                <td className="px-2.5 py-2 text-[11px] text-muted-foreground font-semibold w-[35%] border-r border-border/40 bg-muted/10 select-none  tracking-tight">
                                                    Peso
                                                </td>
                                                <td className="px-2.5 py-2 text-[11px] text-foreground font-medium">
                                                    {producto.weight} kg
                                                </td>
                                            </tr>
                                        )}
                                        {hasDimensions && (
                                            <tr className="hover:bg-muted/5 transition-colors">
                                                <td className="px-2.5 py-2 text-[11px] text-muted-foreground font-semibold border-r border-border/40 bg-muted/10 select-none  tracking-tight">
                                                    <div className="flex items-center gap-1">
                                                        <Ruler size={10} className="text-muted-foreground/60" />
                                                        Dimensiones
                                                    </div>
                                                </td>
                                                <td className="px-2.5 py-2 text-[11px] text-foreground font-medium">
                                                    {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height} <span className="text-[10px] text-muted-foreground font-normal">cm</span>
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

            {/* ENVÍOS Y DEVOLUCIONES */}
            <AccordionItem value="envios" className="border-none">
                <AccordionTrigger className="hover:no-underline group py-2.5 outline-none">
                    <span className="text-xs font-bold  text-foreground tracking-wider transition-colors group-hover:text-action-cta">
                        Entrega y devoluciones
                    </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pt-0.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border border-border/60 bg-muted/10 p-3 space-y-1 rounded-xs">
                            <p className="text-[9px] font-bold  tracking-wider text-muted-foreground select-none">
                                Fecha estimada
                            </p>
                            <p className="text-base font-bold text-foreground tracking-tight leading-tight">
                                {getDeliveryRange(producto.diasEnvio || 1)}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-normal pt-0.5">
                                Tiempo estimado de llegada a domicilio.
                            </p>
                        </div>

                        <div className="border border-border/60 bg-muted/10 p-3 space-y-2 rounded-xs flex flex-col justify-between">
                            <div>
                                <p className="text-[9px] font-bold  tracking-wider text-muted-foreground select-none">
                                    Devoluciones
                                </p>
                                <p className="text-[11px] text-muted-foreground font-normal leading-relaxed mt-0.5">
                                    <span className="text-foreground font-semibold">7 días</span> para cambios por fallas técnicas de origen.
                                </p>
                            </div>
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-[11px] font-bold text-action-cta hover:underline  tracking-wider group/link pt-1"
                            >
                                <FileText size={11} className="mr-1" />
                                Ver términos
                                <ChevronRight size={11} className="ml-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* GARANTÍA */}
            <AccordionItem value="garantia" className="border-none">
                <AccordionTrigger className="hover:no-underline group py-2.5 outline-none">
                    <span className="text-xs font-bold  text-foreground tracking-wider transition-colors group-hover:text-action-cta">
                        Garantía
                    </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0.5">
                    <div className="space-y-1.5 text-xs text-muted-foreground font-normal leading-relaxed">
                        <p>
                            Todos los productos son <span className="text-foreground font-semibold">100% originales</span>.
                        </p>
                        <p>
                            La garantía es de <span className="text-foreground font-semibold">12 meses</span> por fallas técnicas de origen, con respaldo oficial de la marca.
                        </p>
                        <p className="border-l-2 border-border pl-2.5 py-0.5 text-muted-foreground/80 italic text-[11px]">
                            Conserva tu comprobante de compra para hacer efectiva la cobertura.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}