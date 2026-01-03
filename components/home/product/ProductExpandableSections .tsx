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
            className="w-full px-4 py-2 mb-6 bg-white"
        >
            <AccordionItem value="descripcion-especificaciones">
                <AccordionTrigger>Información del producto</AccordionTrigger>
                <AccordionContent>
                    <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {hasDescripcion && (
                            <div className={descripcionColSpan}>
                                <div
                                    className="prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: producto.descripcion ?? "",
                                    }}
                                />
                            </div>
                        )}

                        {hasSpecs && (
                            <div className={specsColSpan}>
                                <h2 className="font-semibold text-base border-b pb-1 mb-2">
                                    Especificaciones
                                </h2>

                                <table className="w-full text-sm border-collapse">
                                    <tbody>
                                        {producto.especificaciones!.map((spec) => (
                                            <tr
                                                key={spec.key}
                                                className="even:bg-gray-50 "
                                            >
                                                <td className="px-3 py-2 w-1/3 font-medium">
                                                    {spec.key}
                                                </td>
                                                <td className="px-3 py-2">{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cambios-devoluciones-vendedores">
                <AccordionTrigger>Envíos, devoluciones y vendedores</AccordionTrigger>
                <AccordionContent>
                    <div className="mx-auto text-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p>
                                <strong>En GoPhone lo hacemos fácil</strong>
                            </p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>Envío con tarifa única.</li>
                                <li>
                                    <Link
                                        href="/hc/garantias-y-devoluciones"
                                        className="underline"
                                    >
                                        Política de devoluciones
                                    </Link>
                                </li>
                            </ul>

                            <p>
                                Puedes solicitar un cambio o devolución dentro de{" "}
                                <strong>3 días hábiles</strong> si el producto tiene falla o
                                llega dañado. Debe estar nuevo, sin uso y con empaque original.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p>
                                Reembolsos se procesan en un máximo de{" "}
                                <strong>72 horas hábiles</strong> tras validar el producto.
                            </p>

                            <p>
                                <strong>Entrega estimada:</strong>{" "}
                                {getDeliveryRange(producto.diasEnvio || 0)}
                            </p>

                            <p>
                                Precios con impuestos incluidos. Producto con garantía oficial
                                del fabricante.
                            </p>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Sobre nuestra garantía">
                <AccordionTrigger>Sobre nuestra garantía</AccordionTrigger>
                <AccordionContent>
                    <div className="mx-auto text-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <p>
                                Todos nuestros productos cuentan con{" "}
                                <strong>garantía oficial del fabricante</strong>.
                            </p>
                            <p>
                                En caso de presentar fallas, te ayudamos a gestionar la
                                garantía directamente con el fabricante.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <p>
                                La cobertura y duración de la garantía dependen del fabricante
                                y del producto.
                            </p>
                            <p>
                                Para más información, revisa los términos de garantía en la
                                página del fabricante.
                            </p>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
