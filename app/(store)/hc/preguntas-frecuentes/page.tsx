import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PreguntasFrecuentesPage() {
    return (
        <section className="max-w-5xl mx-auto px-4 space-y-8">

            {/* Título */}
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-7 h-7 text-gray-700" />
                Preguntas Frecuentes
            </h1>

            {/* Intro */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">
                    Aquí encontrarás respuestas a las dudas más comunes relacionadas con compras,
                    envíos, garantías y más. Si necesitas ayuda adicional, no dudes en contactarnos.
                </p>
            </div>

            {/* Accordion */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
                <Accordion type="single" collapsible className="space-y-3">

                    {/* 1 */}
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Cómo puedo realizar una compra?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            Selecciona tu producto, agrégalo al carrito y finaliza tu compra a través
                            de nuestros métodos de pago: Visa, Mastercard, American Express,
                            Mercado Pago o Yape.
                        </AccordionContent>
                    </AccordionItem>

                    {/* 2 */}
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Hacen envíos a todo el Perú?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            Sí, realizamos envíos a nivel nacional mediante courier seguro.
                            Los tiempos de entrega dependen de tu localidad.
                        </AccordionContent>
                    </AccordionItem>

                    {/* 3 */}
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Qué hago si mi producto llega dañado?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            Si el producto presenta falla o daño de transporte, puedes solicitar
                            cambio o devolución dentro de los <b>3 días hábiles</b> posteriores a la
                            entrega. Debes conservar caja, sellos y accesorios.
                        </AccordionContent>
                    </AccordionItem>

                    {/* 4 */}
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Qué métodos de pago aceptan?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            Aceptamos:
                            • Visa
                            • Mastercard
                            • American Express
                            • Mercado Pago
                            • Yape
                        </AccordionContent>
                    </AccordionItem>

                    {/* 5 */}
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Puedo devolver mi producto si ya fue abierto o activado?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            No. Para aplicar a devolución el producto debe estar nuevo, sellado y sin uso.
                            No aplica para equipos activados, usados o con manipulación.
                        </AccordionContent>
                    </AccordionItem>

                    {/* 6 */}
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-sm font-medium">
                            ¿Cuál es el horario de atención?
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                            Nuestro horario es de <b>Lunes a Sábado de 10am a 7pm</b>.
                            Puedes escribirnos por WhatsApp o correo en cualquier momento y te
                            responderemos lo antes posible.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>

            <p className="text-[11px] text-gray-400 italic text-center">
                ¿No encontraste lo que buscabas? Contáctanos y te ayudamos.
            </p>

            {/* Botón volver */}
            <div className="text-center mt-6">
                <Link
                    href="/"
                    className="inline-block bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                    Volver al inicio
                </Link>
            </div>

        </section>
    );
}
