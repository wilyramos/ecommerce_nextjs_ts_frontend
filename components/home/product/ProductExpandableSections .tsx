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
import { Truck, ShieldCheck, Info, ChevronRight, FileText } from "lucide-react";

type Props = {
    producto: ProductWithCategoryResponse
};

export default function ProductExpandableSections({ producto }: Props) {
    const descripcionRaw = producto.descripcion ?? "";
    const specsArray = producto.especificaciones ?? [];

    const hasDescripcion = Boolean(descripcionRaw.trim().length > 0);
    const hasSpecs = Boolean(specsArray.length > 0);

    if (!hasDescripcion && !hasSpecs) return null;

    /**
     * Lógica de prioridad:
     * Comparamos el peso visual aproximado. 
     * Cada spec cuenta como ~100 caracteres de "peso".
     */
    const descWeight = descripcionRaw.length;
    const specsWeight = specsArray.length * 100;
    const showDescFirst = descWeight >= specsWeight;

    const DescripcionComponent = (
        <div className={`${hasSpecs ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
            <div
                className="
                    prose prose-sm max-w-none 
                    text-[var(--color-text-secondary)] 
                    prose-headings:text-[var(--color-text-primary)] 
                    prose-headings:font-semibold
                    prose-strong:text-[var(--color-text-primary)]
                    prose-strong:font-semibold
                    prose-p:leading-relaxed
                    prose-a:text-[var(--color-action-primary)]
                    prose-a:hover:text-[var(--color-action-primary-hover)]
                    text-sm md:text-base
                "
                dangerouslySetInnerHTML={{ __html: descripcionRaw }}
            />
        </div>
    );

    const SpecsComponent = (
        <div className="lg:col-span-5 space-y-6">
            <div className="overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th colSpan={2} className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] ">
                                Especificaciones técnicas
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border-subtle)]">
                        {specsArray.map((spec) => (
                            <tr key={spec.key} className="group hover:bg-[var(--color-bg-secondary)] transition-colors">
                                <td className="px-5 py-3 text-xs font-medium text-[var(--color-text-secondary)] w-[40%]">
                                    {spec.key}
                                </td>
                                <td className="px-5 py-3 text-sm font-semibold text-[var(--color-text-primary)] w-[60%]">
                                    {spec.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <Accordion type="multiple" className="w-full space-y-1 bg-[var(--color-bg-primary)] pt-4">
            {/* SECCIÓN 1: INFORMACIÓN */}
            <AccordionItem value="info" className="border-b border-[var(--color-border-subtle)]">
                <AccordionTrigger className="py-6 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-action-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
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
            <AccordionItem value="envios" className="border-b border-[var(--color-border-subtle)]">
                <AccordionTrigger className="py-6 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <Truck size={20} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-action-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                            Entrega y Devoluciones
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pt-2 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Card Fecha Estimada */}
                        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] p-6 group hover:border-[var(--color-border-default)] hover:shadow-sm transition-all">
                            <h4 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase mb-4 tracking-widest">Fecha estimada</h4>
                            <p className="text-3xl font-light text-[var(--color-text-primary)] tracking-tight">
                                {getDeliveryRange(producto.diasEnvio || 1)}
                            </p>
                            <div className="mt-3 h-px bg-[var(--color-border-subtle)]" />
                            <p className="text-xs text-[var(--color-text-secondary)] mt-3">
                                Tiempo estimado de llegada a tu domicilio
                            </p>
                        </div>

                        {/* Card Política Devoluciones */}
                        <div className="flex flex-col justify-center space-y-5 border border-[var(--color-border-subtle)] p-6 bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-default)] hover:shadow-sm transition-all">
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Política de devoluciones</h4>
                                <p className="text-sm text-[var(--color-text-secondary)] leading-snug">
                                    Periodo de <span className="text-[var(--color-text-primary)] font-semibold">7 días</span> para gestionar cambios por fallas técnicas de origen.
                                </p>
                            </div>
                            <Link 
                                href="/hc/garantias-y-devoluciones" 
                                className="inline-flex items-center text-sm font-semibold text-[var(--color-action-primary)] hover:text-[var(--color-action-primary-hover)] transition-colors group/link"
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
                <AccordionTrigger className="py-6 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-action-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--color-text-primary)]">
                            Garantía
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pb-10 pt-2 px-1">
                    <div className="max-w-7xl border-l-4 border-[var(--color-action-primary)] pl-6 py-2 bg-[var(--color-action-primary-light)] rounded-r-lg py-4 px-4">
                        <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
                            Todos los productos son <span className="text-[var(--color-text-primary)] font-semibold">100% originales.</span> Generalmente para la mayoría de productos, la garantía es de <span className="text-[var(--color-text-primary)] font-semibold">12 meses</span> por fallas técnicas de origen, pero puede variar dependiendo del tipo de producto.
                            Cuentan con respaldo oficial de hardware válido directamente de la misma marca.
                        </p>
                    </div>
                    <div className="mt-6 p-4 bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            <span className="text-[var(--color-text-primary)] font-semibold">
                            </span> Conservar el comprobante para cambios, garantías y devoluciones.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}