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
    if (!producto.descripcion && !producto.especificaciones?.length) return null;

    return (
        <Accordion
            type="multiple"
            className="w-full px-4 py-2 mb-6 bg-white"
        >
            {producto.descripcion && (
                <AccordionItem value="descripcion">
                    <AccordionTrigger>Descripción</AccordionTrigger>
                    <AccordionContent>
                        <div className="text-gray-700  mx-auto lg:grid lg:grid-cols-2 lg:gap-6 text-sm">
                            <div
                                className="col-span-2 lg:col-span-2"
                                dangerouslySetInnerHTML={{ __html: producto.descripcion }}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            )}

            {producto.especificaciones?.length ? (
                <AccordionItem value="especificaciones">
                    <AccordionTrigger>Especificaciones</AccordionTrigger>
                    <AccordionContent>
                        <div className=" mx-auto lg:grid lg:grid-cols-2 lg:gap-6">
                            <table className="w-full text-xs col-span-2">
                                <tbody>
                                    {producto.especificaciones.map((spec) => (
                                        <tr
                                            key={spec.key}
                                            className="even:bg-gray-100 border-b"
                                        >
                                            <td className="px-3 py-2 w-1/3">{spec.key}</td>
                                            <td className="px-3 py-2">{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ) : null}

            <AccordionItem value="cambios-devoluciones-vendedores">
                <AccordionTrigger>Envíos, devoluciones y vendedores</AccordionTrigger>
                <AccordionContent>
                    <div className="text-gray-700 text-sm space-y-4  mx-auto lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                        <div className="space-y-3">
                            <p><strong>En GoPhone lo hacemos fácil</strong></p>

                            <ul className="list-disc list-inside space-y-1">
                                <li>Envío con tarifa única.</li>
                                <li>
                                    <Link href="/politicas-devolucion" className="underline">
                                        Política de devoluciones
                                    </Link>
                                </li>
                            </ul>

                            <p>
                                Puedes solicitar un cambio o devolución dentro de los{" "}
                                <strong>3 días hábiles</strong> si el producto tiene falla o llega dañado.
                                Debe estar nuevo, sin uso y con empaque original.
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

                            <p>Precios con impuestos incluidos. Producto con garantía oficial del fabricante.</p>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
