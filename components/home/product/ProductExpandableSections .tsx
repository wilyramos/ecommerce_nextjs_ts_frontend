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
import { Truck, ShieldCheck, Info, ChevronRight } from "lucide-react";

type Props = { producto: ProductWithCategoryResponse };

export default function ProductExpandableSections({ producto }: Props) {
    const hasDescripcion = Boolean(producto.descripcion);
    const hasSpecs = Boolean(producto.especificaciones?.length);

    if (!hasDescripcion && !hasSpecs) return null;

    return (
        <Accordion
            type="multiple"
            defaultValue={["descripcion-especificaciones"]}
            className="w-full space-y-2"
        >
            {/* SECCIÓN 1: INFORMACIÓN Y ESPECIFICACIONES */}
            <AccordionItem
                value="descripcion-especificaciones"
                className="border-b border-[var(--store-border)] px-4 md:px-0"
            >
                <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base md:text-lg font-semibold tracking-tight text-[var(--store-text)]">
                            Información del producto
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-10 pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

                        {/* Descripción (Izquierda/Full) */}
                        <div className={`${hasSpecs ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
                            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--store-text-muted)]">
                                Resumen
                            </h3>
                            <div
                                className="prose prose-sm max-w-none text-[var(--store-text)] leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{ __html: producto.descripcion ?? "" }}
                            />
                        </div>

                        {/* Ficha Técnica (Derecha) - Estilo Apple Specs */}
                        {hasSpecs && (
                            <div className="lg:col-span-5 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--store-text-muted)]">
                                    Especificaciones
                                </h3>
                                <div className="divide-y divide-[var(--store-border)]">
                                    {producto.especificaciones!.map((spec) => (
                                        <div key={spec.key} className="py-3 flex justify-between gap-4">
                                            <span className="text-sm font-medium text-[var(--store-text)] w-1/3">
                                                {spec.key}
                                            </span>
                                            <span className="text-sm text-[var(--store-text-muted)] w-2/3 text-right">
                                                {spec.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* SECCIÓN 2: ENVÍOS Y DEVOLUCIONES */}
            <AccordionItem
                value="cambios-devoluciones-vendedores"
                className="border-b border-[var(--store-border)] px-4 md:px-0"
            >
                <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex items-center gap-3">
                        <Truck size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base md:text-lg font-semibold tracking-tight text-[var(--store-text)]">
                            Entrega y Devoluciones
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-10 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Entrega Estimada Box */}
                        <div className="bg-[var(--store-bg)] rounded-3xl p-6 flex flex-col justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--store-text)] mb-2 flex items-center gap-2">
                                    Entrega estimada
                                </h4>
                                <p className="text-2xl font-semibold text-[var(--store-text)] tracking-tight">
                                    {getDeliveryRange(producto.diasEnvio || 0)}
                                </p>
                            </div>
                            <p className="text-xs text-[var(--store-text-muted)] mt-6">
                                * Los tiempos de entrega varían según la ubicación y el método de envío seleccionado.
                            </p>
                        </div>

                        {/* Políticas */}
                        <div className="flex flex-col justify-center space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-[var(--store-text)]">Gestión GoPhone</h4>
                                <p className="text-sm text-[var(--store-text-muted)] leading-relaxed">
                                    Ofrecemos cambios en un plazo de <span className="font-semibold text-[var(--store-text)]">3 días hábiles</span> por fallas de fábrica. El empaque debe estar sellado.
                                </p>
                            </div>
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-sm font-medium text-[var(--store-primary)] hover:underline group/link"
                            >
                                Ver política de devoluciones <ChevronRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* SECCIÓN 3: GARANTÍA */}
            <AccordionItem
                value=" Sobre nuestra garantía"
                className="border-0 px-4 md:px-0"
            >
                <AccordionTrigger className="py-6 hover:no-underline group">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base md:text-lg font-semibold tracking-tight text-[var(--store-text)]">
                            Garantía Oficial
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-10 pt-2">
                    <div className="max-w-3xl">
                        <p className="text-sm md:text-base text-[var(--store-text-muted)] leading-relaxed">
                            Todos nuestros productos son <span className="text-[var(--store-text)] font-medium">100% originales</span> y cuentan con garantía oficial gestionada directamente con el fabricante. La vigencia varía según la marca del dispositivo; te recomendamos conservar tu comprobante de compra para cualquier gestión técnica.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}