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
import { ListChecks, ChevronRight, FileText, Package, Ruler } from "lucide-react";

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
        <Accordion type="multiple" defaultValue={[defaultOpen]} className="w-full divide-y divide-border border-b border-border px-1">

            {/* DESCRIPCIÓN */}
            {hasDescripcion && (
                <AccordionItem value="descripcion" className="border-none">
                    <AccordionTrigger className="hover:no-underline group py-3 outline-none">
                        <div className="flex items-center gap-2.5">
                            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                Descripción del producto
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-1">
                        <div
                            className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:leading-relaxed prose-p:text-sm prose-a:text-action-cta"
                            dangerouslySetInnerHTML={{ __html: descripcionRaw }}
                        />
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* ESPECIFICACIONES */}
            {hasSpecs && (
                <AccordionItem value="specs" className="border-none">
                    <AccordionTrigger className="hover:no-underline group py-3 outline-none">
                        <div className="flex items-center gap-2.5">
                            <ListChecks size={15} className="text-muted-foreground shrink-0" />
                            <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                                Especificaciones técnicas
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-1 space-y-4">
                        {specsArray.length > 0 && (
                            <div className="overflow-x-auto w-full border border-border rounded-md">
                                <table className="w-full text-left border-collapse text-sm">
                                    <tbody className="divide-y divide-border/50">
                                        {specsArray.map((spec) => (
                                            <tr key={spec.key} className="hover:bg-muted/10 transition-colors">
                                                <td className="px-3 py-2.5 text-xs text-muted-foreground font-semibold w-[35%] border-r border-border/50 bg-muted/5">
                                                    {spec.key}
                                                </td>
                                                <td className="px-3 py-2.5 text-xs text-foreground break-words">
                                                    {spec.value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {hasPhysicalData && (
                            <div className="overflow-x-auto w-full border border-border rounded-md">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr>
                                            <th colSpan={2} className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                                                <div className="flex items-center gap-1.5">
                                                    <Package size={12} />
                                                    Físico y embalaje
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {hasWeight && (
                                            <tr className="hover:bg-muted/10 transition-colors">
                                                <td className="px-3 py-2.5 text-xs text-muted-foreground font-semibold w-[35%] border-r border-border/50 bg-muted/5">
                                                    Peso
                                                </td>
                                                <td className="px-3 py-2.5 text-xs text-foreground">
                                                    {producto.weight} kg
                                                </td>
                                            </tr>
                                        )}
                                        {hasDimensions && (
                                            <tr className="hover:bg-muted/10 transition-colors">
                                                <td className="px-3 py-2.5 text-xs text-muted-foreground font-semibold border-r border-border/50 bg-muted/5">
                                                    <div className="flex items-center gap-1">
                                                        <Ruler size={11} />
                                                        Dimensiones
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2.5 text-xs text-foreground">
                                                    {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height} <span className="text-[10px] text-muted-foreground">cm</span>
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
                <AccordionTrigger className="hover:no-underline group py-3 outline-none">
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            Entrega y devoluciones
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="border border-border bg-muted/10 p-4 space-y-1.5 rounded-md">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Fecha estimada
                            </p>
                            <p className="text-xl font-extrabold text-foreground tracking-tight leading-none">
                                {getDeliveryRange(producto.diasEnvio || 1)}
                            </p>
                            <p className="text-xs text-muted-foreground pt-1">
                                Tiempo estimado de llegada a domicilio.
                            </p>
                        </div>

                        <div className="border border-border bg-muted/10 p-4 space-y-2.5 rounded-md flex flex-col justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    Devoluciones
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                    <span className="text-foreground font-medium">7 días</span> para cambios por fallas técnicas de origen.
                                </p>
                            </div>
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-xs text-action-cta hover:underline group/link pt-2"
                            >
                                <FileText size={12} className="mr-1.5" />
                                Ver términos
                                <ChevronRight size={12} className="ml-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* GARANTÍA */}
            <AccordionItem value="garantia" className="border-none">
                <AccordionTrigger className="hover:no-underline group py-3 outline-none">
                    <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                            Garantía
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                    <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                        <p>
                            Todos los productos son <span className="text-foreground font-medium">100% originales</span>.
                        </p>
                        <p>
                            La garantía es de <span className="text-foreground font-medium">12 meses</span> por fallas técnicas de origen, con respaldo oficial de la marca.
                        </p>
                        <p className="border-l-2 border-border pl-3 py-0.5 text-muted-foreground/80 italic">
                            Conserva tu comprobante de compra para hacer efectiva la cobertura.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}