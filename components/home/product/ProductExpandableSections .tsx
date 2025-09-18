"use client"

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import type { ProductWithCategoryResponse } from "@/src/schemas";

type Props = { producto: ProductWithCategoryResponse };

export default function ProductExpandableSections({ producto }: Props) {

    if (!producto.descripcion && !producto.especificaciones?.length) {
        return null;
    }

    return (
        <Accordion
            type="multiple"
            className="w-full rounded-lg px-6 py-3 shadow-sm bg-white"
        >
            {producto.descripcion && (
                <AccordionItem value="descripcion">
                    <AccordionTrigger className="font-semibold text-gray-800 hover:cursor-pointer hover:text-black text-base">
                        Descripción
                    </AccordionTrigger>
                    <AccordionContent className=" text-gray-700">
                        <div dangerouslySetInnerHTML={{ __html: producto.descripcion }} />
                    </AccordionContent>
                </AccordionItem>
            )}

            {producto.especificaciones?.length ? (
                <AccordionItem value="especificaciones">
                    <AccordionTrigger className="font-semibold text-gray-800 hover:cursor-pointer hover:text-black text-base">
                        Especificaciones
                    </AccordionTrigger>
                    <AccordionContent>
                        <table className="w-full text-sm">
                            <tbody>
                                {producto.especificaciones.map((spec) => (
                                    <tr key={spec.key} className="even:bg-gray-100 border-b">
                                        <td className="px-3 py-2 font-semibold w-1/3">
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
        </Accordion>
    );
}
