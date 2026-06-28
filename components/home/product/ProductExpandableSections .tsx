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
import { Truck, ShieldCheck, Info, ChevronRight, FileText, Package, Ruler } from "lucide-react";

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

    const showDescFirst = descripcionRaw.length >= specsArray.length * 100;

    const DescripcionComponent = (
        <div className={hasSpecs ? "lg:col-span-7" : "lg:col-span-12"}>
            <div
                className="
                    prose prose-sm max-w-none
                    text-muted-foreground
                    prose-headings:text-foreground prose-headings:
                    prose-strong:text-foreground prose-strong:
                    prose-p:leading-relaxed prose-p:text-sm
                    prose-a:text-action-cta prose-a:hover:text-action-cta-hover
                "
                dangerouslySetInnerHTML={{ __html: descripcionRaw }}
            />
        </div>
    );

    const SpecsComponent = (
        <div className="lg:col-span-5 space-y-3">
            {specsArray.length > 0 && (
                <table className="w-full text-left border-collapse border border-border text-sm">
                    <tbody className="divide-y divide-border/50">
                        {specsArray.map((spec) => (
                            <tr key={spec.key} className="">
                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium w-[42%] border-r border-border/50">
                                    {spec.key}
                                </td>
                                <td className="px-3 py-2 text-xs  text-foreground">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {hasPhysicalData && (
                <table className="w-full text-left border-collapse border border-border text-sm">
                    <thead>
                        <tr>
                            <th colSpan={2} className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border bg-background-secondary">
                                <div className="flex items-center gap-1.5">
                                    <Package size={11} />
                                    Físico y embalaje
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {hasWeight && (
                            <tr className="">
                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium w-[42%] border-r border-border/50">
                                    Peso
                                </td>
                                <td className="px-3 py-2 text-xs  text-foreground">
                                    {producto.weight} kg
                                </td>
                            </tr>
                        )}
                        {hasDimensions && (
                            <tr className="">
                                <td className="px-3 py-2 text-xs text-muted-foreground font-medium border-r border-border/50">
                                    <div className="flex items-center gap-1">
                                        <Ruler size={10} />
                                        Dimensiones
                                    </div>
                                </td>
                                <td className="px-3 py-2 text-xs  text-foreground">
                                    {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height}
                                    <span className="ml-1 text-[10px] font-normal text-muted-foreground">cm</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );

    return (
        <Accordion type="multiple" className="w-full divide-y divide-border border-b border-border px-2">

            {/* ── INFORMACIÓN ── */}
            <AccordionItem value="info" className="border-none  transition-colors">
                <AccordionTrigger className="hover:no-underline group px-0 py-3 outline-none">
                    <div className="flex items-center gap-2.5">
                        <Info size={15} className="text-muted-foreground shrink-0" />
                        <span className="text-sm  text-foreground hover:text-action-cta-hover transition-colors">
                            Información del producto
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {showDescFirst ? (
                            <>
                                {hasDescripcion && DescripcionComponent}
                                {hasSpecs && SpecsComponent}
                            </>
                        ) : (
                            <>
                                {hasSpecs && SpecsComponent}
                                {hasDescripcion && DescripcionComponent}
                            </>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* ── ENVÍOS ── */}
            <AccordionItem value="envios" className="border-none ">
                <AccordionTrigger className="hover:no-underline group px-0 py-3 outline-none">
                    <div className="flex items-center gap-2.5">
                        <Truck size={15} className="text-muted-foreground shrink-0" />
                        <span className="text-sm  text-foreground hover:text-action-cta-hover transition-colors">
                            Entrega y devoluciones
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-6 pt-1 px-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Entrega */}
                        <div className="border border-border bg-background-secondary p-4 space-y-1.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Fecha estimada
                            </p>
                            <p className="text-2xl font-extrabold text-foreground tracking-tight leading-none">
                                {getDeliveryRange(producto.diasEnvio || 1)}
                            </p>
                            <p className="text-xs text-muted-foreground pt-1">
                                Tiempo estimado de llegada a domicilio
                            </p>
                            {hasWeight && (
                                <p className="text-xs text-muted-foreground">
                                    Peso:{" "}
                                    <span className=" text-foreground">{producto.weight} kg</span>
                                </p>
                            )}
                        </div>

                        {/* Devoluciones */}
                        <div className="border border-border bg-background-secondary p-4 space-y-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Devoluciones
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                <span className=" text-foreground">7 días</span> para cambios
                                por fallas técnicas de origen.
                            </p>
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-xs  text-action-cta hover:text-action-cta-hover transition-colors group/link outline-none"
                            >
                                <FileText size={12} className="mr-1.5" />
                                Ver términos
                                <ChevronRight size={12} className="ml-0.5 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* ── GARANTÍA ── */}
            <AccordionItem value="garantia" className="border-none ">
                <AccordionTrigger className="hover:no-underline group px-0 py-3 outline-none">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck size={15} className="text-muted-foreground shrink-0" />
                        <span className="text-sm  text-foreground hover:text-action-cta-hover transition-colors">
                            Garantía
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className=" ">
                    <div className="space-y-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Todos los productos son{" "}
                            <span className=" text-foreground">100% originales</span>.
                            La garantía es generalmente de{" "}
                            <span className=" text-foreground">12 meses</span> por fallas
                            técnicas de origen, con respaldo oficial de la marca. Puede variar según
                            el tipo de producto.
                        </p>
                        <p className="text-xs text-muted-foreground border-l-2 border-border pl-3 py-1">
                            Conserva tu comprobante para cambios, garantías y devoluciones.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
}