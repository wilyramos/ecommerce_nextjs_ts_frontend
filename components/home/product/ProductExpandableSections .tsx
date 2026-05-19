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
    producto: ProductWithCategoryResponse
};

export default function ProductExpandableSections({ producto }: Props) {
    const descripcionRaw = producto.descripcion ?? "";
    const specsArray = producto.especificaciones ?? [];

    // Campos físicos
    const hasWeight = Boolean(producto.weight);
    const hasDimensions = Boolean(
        producto.dimensions?.length ||
        producto.dimensions?.width ||
        producto.dimensions?.height
    );
    const hasPhysicalData = hasWeight || hasDimensions;

    const hasDescripcion = Boolean(descripcionRaw.trim().length > 0);
    const hasSpecs = Boolean(specsArray.length > 0 || hasPhysicalData);

    if (!hasDescripcion && !hasSpecs) return null;

    const descWeight = descripcionRaw.length;
    const specsWeight = specsArray.length * 100;
    const showDescFirst = descWeight >= specsWeight;

    const DescripcionComponent = (
        <div className={`${hasSpecs ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
            <div
                className="
                    prose prose-sm max-w-none 
                    text-muted-foreground 
                    prose-headings:text-foreground 
                    prose-headings:font-bold
                    prose-strong:text-foreground
                    prose-strong:font-bold
                    prose-p:leading-relaxed
                    prose-a:text-action-cta
                    prose-a:hover:text-action-cta-hover
                    text-sm md:text-base
                "
                dangerouslySetInnerHTML={{ __html: descripcionRaw }}
            />
        </div>
    );

    const SpecsComponent = (
        <div className="lg:col-span-5 space-y-4">
            {/* Especificaciones técnicas */}
            {specsArray.length > 0 && (
                <div className="overflow-hidden border border-border bg-background rounded-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th colSpan={2} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground border-b border-border bg-background-secondary">
                                    Especificaciones técnicas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {specsArray.map((spec) => (
                                <tr key={spec.key} className="group hover:bg-background-secondary transition-colors">
                                    <td className="px-5 py-3 text-xs font-semibold text-muted-foreground w-[40%]">
                                        {spec.key}
                                    </td>
                                    <td className="px-5 py-3 text-sm font-bold text-foreground w-[60%]">
                                        {spec.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Peso y dimensiones */}
            {hasPhysicalData && (
                <div className="overflow-hidden border border-border bg-background rounded-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th colSpan={2} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground border-b border-border bg-background-secondary">
                                    <div className="flex items-center gap-2">
                                        <Package size={13} />
                                        Físico y embalaje
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {hasWeight && (
                                <tr className="group hover:bg-background-secondary transition-colors">
                                    <td className="px-5 py-3 text-xs font-semibold text-muted-foreground w-[40%]">
                                        Peso
                                    </td>
                                    <td className="px-5 py-3 text-sm font-bold text-foreground w-[60%]">
                                        {producto.weight} kg
                                    </td>
                                </tr>
                            )}
                            {hasDimensions && (
                                <tr className="group hover:bg-background-secondary transition-colors">
                                    <td className="px-5 py-3 text-xs font-semibold text-muted-foreground w-[40%]">
                                        <div className="flex items-center gap-1.5">
                                            <Ruler size={11} />
                                            Dimensiones
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm font-bold text-foreground w-[60%]">
                                        {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height} cm
                                        <span className="ml-1.5 text-[10px] font-medium text-muted-foreground">
                                            (largo × ancho × alto)
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <Accordion type="multiple" className="w-full space-y-1 bg-background pt-4 text-foreground">

            {/* SECCIÓN 1: INFORMACIÓN */}
            <AccordionItem value="info" className="border-b border-border">
                <AccordionTrigger className="py-6 hover:no-underline group px-1 outline-none">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-muted-foreground group-hover:text-action-cta transition-colors" />
                        <span className="text-base font-bold tracking-tight text-foreground">
                            Información del producto
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pt-2 px-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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

            {/* SECCIÓN 2: ENVÍOS */}
            <AccordionItem value="envios" className="border-b border-border">
                <AccordionTrigger className="py-6 hover:no-underline group px-1 outline-none">
                    <div className="flex items-center gap-3">
                        <Truck size={20} className="text-muted-foreground group-hover:text-action-cta transition-colors" />
                        <span className="text-base font-bold tracking-tight text-foreground">
                            Entrega y Devoluciones
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pt-2 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Card Fecha Estimada */}
                        <div className="bg-background-secondary border border-border p-6 hover:border-border-hover rounded-sm transition-all">
                            <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-widest">
                                Fecha estimada
                            </h4>
                            <p className="text-3xl font-extrabold text-foreground tracking-tight">
                                {getDeliveryRange(producto.diasEnvio || 1)}
                            </p>
                            <div className="mt-3 h-px bg-border/60" />
                            <p className="text-xs text-muted-foreground font-medium mt-3">
                                Tiempo estimado de llegada a tu domicilio
                            </p>
                            {hasWeight && (
                                <p className="text-xs text-muted-foreground mt-1 font-medium">
                                    Peso del paquete: <span className="font-bold text-foreground">{producto.weight} kg</span>
                                </p>
                            )}
                        </div>

                        {/* Card Política Devoluciones */}
                        <div className="flex flex-col justify-center space-y-5 border border-border p-6 bg-background-secondary hover:border-border-hover rounded-sm transition-all">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-foreground">
                                    Política de devoluciones
                                </h4>
                                <p className="text-sm text-muted-foreground font-medium leading-snug">
                                    Periodo de <span className="text-foreground font-bold">7 días</span> para gestionar cambios por fallas técnicas de origen.
                                </p>
                            </div>
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-sm font-bold text-action-cta hover:text-action-cta-hover transition-colors group/link outline-none"
                            >
                                <FileText size={16} className="mr-2" />
                                Leer términos
                                <ChevronRight size={16} className="ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* SECCIÓN 3: GARANTÍA */}
            <AccordionItem value="garantia" className="border-b-0">
                <AccordionTrigger className="py-6 hover:no-underline group px-1 outline-none">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-muted-foreground group-hover:text-action-cta transition-colors" />
                        <span className="text-base font-bold tracking-tight text-foreground">
                            Garantía
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pt-2 px-1">
                    <div className="max-w-7xl border-l-4 border-ring pl-6 py-3 bg-secondary rounded-r-sm">
                        <p className="text-sm md:text-base text-secondary-foreground font-medium leading-relaxed">
                            Todos los productos son <span className="text-foreground font-bold">100% originales.</span> Generalmente para la mayoría de productos, la garantía es de <span className="text-foreground font-bold">12 meses</span> por fallas técnicas de origen, pero puede variar dependiendo del tipo de producto. Cuentan con respaldo oficial de hardware válido directamente de la misma marca.
                        </p>
                    </div>
                    <div className="mt-6 p-4 bg-background-secondary border border-border rounded-sm">
                        <p className="text-sm text-muted-foreground font-semibold">
                            Conservar el comprobante para cambios, garantías y devoluciones.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    );
}