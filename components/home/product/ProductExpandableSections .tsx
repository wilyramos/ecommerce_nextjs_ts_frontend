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

type Props = { producto: ProductWithCategoryResponse };

export default function ProductExpandableSections({ producto }: Props) {
    const hasDescripcion = Boolean(producto.descripcion);
    const hasSpecs = Boolean(producto.especificaciones?.length);

    if (!hasDescripcion && !hasSpecs) return null;

    const descripcionColSpan =
        hasDescripcion && !hasSpecs ? "lg:col-span-2" : "lg:col-span-1";

    const specsColSpan =
        hasSpecs && !hasDescripcion ? "lg:col-span-2" : "lg:col-span-1";

    return (
        <Accordion
            type="multiple"
            defaultValue={["descripcion-especificaciones"]}
            className="w-full px-4 md:px-6 py-2 mb-6 rounded-lg"
            style={{
                backgroundColor: "var(--store-surface)"
            }}
        >
            {/* SECCIÓN 1: INFORMACIÓN Y ESPECIFICACIONES */}
            <AccordionItem value="descripcion-especificaciones" className="border-b" style={{ borderColor: "var(--store-border)" }}>
                <AccordionTrigger
                    className="text-sm md:text-base tracking-wide hover:no-underline py-4"
                    style={{ color: "var(--store-text)" }}
                >
                    Información del producto
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {hasDescripcion && (
                            <div className={`${descripcionColSpan} space-y-3`}>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--store-text)" }}>
                                    Descripción
                                </h3>
                                <div
                                    className="prose prose-sm max-w-none text-sm leading-relaxed"
                                    style={{ color: "var(--store-text-muted)" }}
                                    dangerouslySetInnerHTML={{
                                        __html: producto.descripcion ?? "",
                                    }}
                                />
                            </div>
                        )}

                        {hasSpecs && (
                            <div className={specsColSpan}>
                                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--store-text)" }}>
                                    Ficha Técnica
                                </h3>
                                <div className="rounded-md border overflow-hidden" style={{ borderColor: "var(--store-border)" }}>
                                    <table className="w-full text-xs md:text-sm border-collapse">
                                        <tbody>
                                            {producto.especificaciones!.map((spec) => (
                                                <tr
                                                    key={spec.key}
                                                    className="border-b last:border-0"
                                                    style={{ borderColor: "var(--store-border)" }}
                                                >
                                                    <td
                                                        className="px-4 py-2.5 w-1/3 font-semibold bg-gray-50/50"
                                                        style={{
                                                            color: "var(--store-text)",
                                                            backgroundColor: "var(--store-surface-hover)"
                                                        }}
                                                    >
                                                        {spec.key}
                                                    </td>
                                                    <td className="px-4 py-2.5" style={{ color: "var(--store-text-muted)" }}>
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* SECCIÓN 2: ENVÍOS Y DEVOLUCIONES */}
            <AccordionItem value="cambios-devoluciones-vendedores" className="border-b" style={{ borderColor: "var(--store-border)" }}>
                <AccordionTrigger
                    className="text-sm md:text-base tracking-wide hover:no-underline py-4"
                    style={{ color: "var(--store-text)" }}
                >
                    Envíos, devoluciones y vendedores
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm leading-relaxed" style={{ color: "var(--store-text-muted)" }}>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold mb-1" style={{ color: "var(--store-text)" }}>Gestión GoPhone</h4>
                                <ul className="list-disc list-inside space-y-1.5 ml-1">
                                    <li>Envío con tarifa única nacional.</li>
                                    <li>
                                        <Link
                                            href="/hc/garantias-y-devoluciones"
                                            className="underline decoration-2 underline-offset-4 transition-colors"
                                            style={{ color: "var(--store-primary)" }}
                                        >
                                            Política de devoluciones
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <p>
                                Solicitudes de cambio en <strong style={{ color: "var(--store-text)" }}>3 días hábiles</strong> por fallas de origen. El empaque debe permanecer original y sellado.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--store-surface-hover)" }}>
                                <p className="mb-2">
                                    <span className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--store-text)" }}>Entrega estimada</span>
                                    {getDeliveryRange(producto.diasEnvio || 0)}
                                </p>
                                <p className="text-xs">
                                    * Reembolsos procesados en un máximo de 72h tras validación técnica.
                                </p>
                            </div>
                            <p className="text-xs italic">
                                Producto garantizado por el fabricante.
                            </p>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* SECCIÓN 3: GARANTÍA */}
            <AccordionItem value="Sobre nuestra garantía" className="border-0">
                <AccordionTrigger
                    className="text-sm md:text-base tracking-wide hover:no-underline py-4"
                    style={{ color: "var(--store-text)" }}
                >
                    Sobre nuestra garantía
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm leading-relaxed" style={{ color: "var(--store-text-muted)" }}>
                        <div className="space-y-3">
                            <p>
                                Todos nuestros productos cuentan con <strong style={{ color: "var(--store-text)" }}>garantía oficial</strong>.
                                Gestionamos directamente con el fabricante para tu tranquilidad.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p>
                                La vigencia depende de la marca. Recomendamos conservar la boleta o factura para cualquier requerimiento técnico.
                            </p>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}