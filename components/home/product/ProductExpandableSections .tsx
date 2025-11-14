"use client"

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
    if (!producto.descripcion && !producto.especificaciones?.length) {
        return null;
    }

    return (
        <Accordion
            type="multiple"
            className="w-full px-4 py-2 mb-6 bg-white"
        >
            {producto.descripcion && (
                <AccordionItem value="descripcion">
                    <AccordionTrigger>
                        Descripción
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 max-w-3xl mx-auto">
                        <div dangerouslySetInnerHTML={{ __html: producto.descripcion }} />
                    </AccordionContent>
                </AccordionItem>
            )}

            {producto.especificaciones?.length ? (
                <AccordionItem value="especificaciones">
                    <AccordionTrigger>
                        Especificaciones
                    </AccordionTrigger>
                    <AccordionContent>
                        <table className="w-full text-xs max-w-3xl mx-auto" >
                            <tbody>
                                {producto.especificaciones.map((spec) => (
                                    <tr key={spec.key} className="even:bg-gray-100 border-b">
                                        <td className="px-3 py-2 w-1/3">
                                            {spec.key}
                                        </td>
                                        <td className="px-3 py-2">{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionContent>
                </AccordionItem>
            ) : null}

            <AccordionItem value="cambios-devoluciones-vendedores">
                <AccordionTrigger>
                    Envíos, devoluciones y vendedores
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 text-sm space-y-1 max-w-3xl mx-auto">
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
                        Puedes solicitar un cambio o devolución dentro de los <strong>3 días hábiles</strong> si el producto tiene falla o llega dañado.
                        Debe estar nuevo, sin uso y con empaque original.
                    </p>

                    <p>
                        Reembolsos se procesan en un máximo de <strong>72 horas hábiles</strong> tras validar el producto.
                    </p>

                    <p>
                        <strong>Entrega estimada:</strong> {getDeliveryRange(producto.diasEnvio || 0)}
                    </p>

                    <p>Precios con impuestos incluidos. Producto con garantía oficial del fabricante.</p>
                </AccordionContent>

            </AccordionItem>
        </Accordion>
    );
}
