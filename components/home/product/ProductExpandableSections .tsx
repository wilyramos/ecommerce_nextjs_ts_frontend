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
    const hasDescripcion = Boolean(producto.descripcion && producto.descripcion.trim().length > 0);
    const hasSpecs = Boolean(producto.especificaciones && producto.especificaciones.length > 0);

    // Si no hay nada que mostrar, no renderizamos nada para mantener la limpieza visual
    if (!hasDescripcion && !hasSpecs) return null;

    return (
        <Accordion
            type="multiple"
            defaultValue={["info", "envios"]} // "info" abierto por defecto
            className="w-full space-y-4 bg-[var(--store-bg)]" // Usar variable de fondo para consistencia
        >
            {/* =========================================================
                SECCIÓN 1: INFORMACIÓN Y ESPECIFICACIONES
               ========================================================= */}
            <AccordionItem
                value="info"
                className="border-b border-[var(--store-border)]"
            >
                <AccordionTrigger className="py-5 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <Info size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--store-text)]">
                            Información del producto
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-8 pt-2 px-1">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

                        {/* Columna Izquierda: Descripción HTML */}
                        <div className={`${hasSpecs ? "lg:col-span-7" : "lg:col-span-12"} space-y-4`}>
                            {hasDescripcion && (
                                <>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--store-text-muted)] mb-4">
                                        Resumen
                                    </h3>
                                    {/* Clases 'prose' personalizadas para respetar el tema oscuro/claro */}
                                    <div
                                        className="
                                            prose prose-sm max-w-none 
                                            text-[var(--store-text)] 
                                            prose-headings:text-[var(--store-text)] 
                                            prose-p:text-[var(--store-text-muted)]
                                            prose-strong:text-[var(--store-text)]
                                            prose-li:text-[var(--store-text-muted)]
                                            leading-relaxed font-normal
                                        "
                                        dangerouslySetInnerHTML={{ __html: producto.descripcion ?? "" }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Columna Derecha: Ficha Técnica (Estilo Tabla Apple) */}
                        {hasSpecs && (
                            <div className="lg:col-span-5 space-y-5">
                                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--store-text-muted)]">
                                    Especificaciones
                                </h3>
                                <div className="divide-y divide-[var(--store-border)]">
                                    {producto.especificaciones?.map((spec) => (
                                        <div key={spec.key} className="py-3 flex justify-between gap-6">
                                            <span className="text-sm font-medium text-[var(--store-text)] w-[40%] break-words">
                                                {spec.key}
                                            </span>
                                            <span className="text-sm text-[var(--store-text-muted)] w-[60%] text-right break-words">
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

            {/* =========================================================
                SECCIÓN 2: ENVÍOS Y DEVOLUCIONES
               ========================================================= */}
            <AccordionItem
                value="envios"
                className="border-b border-[var(--store-border)]"
            >
                <AccordionTrigger className="py-5 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <Truck size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--store-text)]">
                            Entrega y Devoluciones
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-8 pt-2 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        
                        {/* Caja de Estimación de Entrega */}
                        <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-2xl p-6 flex flex-col justify-between h-full">
                            <div>
                                <h4 className="text-sm font-bold text-[var(--store-text)] mb-3 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-[var(--store-primary)]" />
                                    Entrega estimada
                                </h4>
                                <p className="text-2xl font-semibold text-[var(--store-text)] tracking-tight">
                                    {getDeliveryRange(producto.diasEnvio || 1)}
                                </p>
                            </div>
                            <p className="text-[11px] text-[var(--store-text-muted)] mt-4 leading-snug">
                                * Los tiempos son estimados para Lima Metropolitana. Provincias pueden tomar 1-2 días adicionales.
                            </p>
                        </div>

                        {/* Información de Políticas */}
                        <div className="flex flex-col justify-center space-y-6 pt-2">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold text-[var(--store-text)]">
                                    Garantía de Satisfacción
                                </h4>
                                <p className="text-sm text-[var(--store-text-muted)] leading-relaxed">
                                    Si el producto presenta fallas de fábrica, gestionamos el cambio inmediato dentro de los primeros <span className="font-semibold text-[var(--store-text)]">7 días hábiles</span>.
                                </p>
                            </div>
                            
                            <Link
                                href="/hc/garantias-y-devoluciones"
                                className="inline-flex items-center text-sm font-medium text-[var(--store-primary)] hover:underline group/link w-fit"
                            >
                                <FileText size={14} className="mr-2" />
                                Ver política completa 
                                <ChevronRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* =========================================================
                SECCIÓN 3: GARANTÍA
               ========================================================= */}
            <AccordionItem
                value="garantia"
                className="border-b-0" // Quitamos borde final para limpieza
            >
                <AccordionTrigger className="py-5 hover:no-underline group px-1">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={20} className="text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] transition-colors" />
                        <span className="text-base font-semibold tracking-tight text-[var(--store-text)]">
                            Garantía Oficial
                        </span>
                    </div>
                </AccordionTrigger>

                <AccordionContent className="pb-8 pt-2 px-1">
                    <div className="max-w-3xl">
                        <p className="text-sm md:text-base text-[var(--store-text-muted)] leading-relaxed">
                            Todos nuestros productos en <span className="font-bold text-[var(--store-text)]">GoPhone</span> son 100% originales. 
                            Cuentan con garantía oficial válida directamente con nosotros o con el centro autorizado de la marca (Apple, Samsung, Xiaomi). 
                            <br /><br />
                            Conservar tu comprobante de pago es indispensable para validar la vigencia de tu protección.
                        </p>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}