"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { H1, H3, Lead, Muted } from "@/components/ui/Typography";

export default function PreguntasFrecuentesPage() {
    const faqs = [
        {
            question: "¿Cómo puedo realizar una compra?",
            answer: "El proceso es simple: selecciona tu producto, agrégalo a tu bolsa de compra y finaliza la transacción eligiendo tu método de pago preferido. Recibirás una notificación inmediata al completar el pedido."
        },
        {
            question: "¿Hacen envíos a todo el Perú?",
            answer: "Sí. Realizamos despachos a nivel nacional a través de couriers certificados. Los tiempos de entrega varían entre 24h para Cañete y de 48h a 72h para el resto de provincias."
        },
        {
            question: "¿Qué hago si mi producto llega con daños de fábrica?",
            answer: "La calidad es nuestra prioridad. Si el producto presenta fallas, puedes solicitar un cambio o devolución dentro de los primeros 3 días hábiles tras la entrega. Es indispensable conservar el empaque original, sellos y accesorios."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos una amplia variedad de pagos seguros: Visa, Mastercard, American Express, Mercado Pago, Yape y Plin. Todas las transacciones están cifradas para tu seguridad."
        },
        {
            question: "¿Puedo devolver un equipo si ya fue activado?",
            answer: "No. Por políticas de seguridad y garantía de marca, los dispositivos que han sido abiertos, encendidos o activados no admiten devolución por arrepentimiento de compra. Solo aplican devoluciones por fallas técnicas demostrables."
        },
        {
            question: "¿Cuál es el horario de atención?",
            answer: "Nuestro equipo de soporte está disponible de Lunes a Sábado de 10:00 am a 7:00 pm. Fuera de ese horario, puedes dejarnos un mensaje por WhatsApp y te contactaremos a primera hora."
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 select-none bg-background text-foreground">

            {/* --- CABECERA EDITORIAL --- */}
            <header className="mb-14 text-start">
                <div className="inline-flex items-center gap-2 border-l-2 border-action-cta pl-2.5 py-0.5 mb-5">
                    <HelpCircle size={12} className="text-action-cta" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-action-cta">
                        Centro de Soporte
                    </span>
                </div>
                <H1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2">
                    Preguntas frecuentes.
                </H1>
                <Lead className="text-lg md:text-2xl font-medium text-muted-foreground">
                    Todo lo que necesitas saber.
                </Lead>
            </header>

            {/* --- CONTENEDOR DE ACORDEÓN --- */}
            <div className="bg-background border border-border/60 rounded-sm p-4 md:p-8">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-b border-border/40 last:border-none py-1"
                        >
                            <AccordionTrigger className="text-left text-[14px] md:text-[15px] font-bold text-foreground hover:text-action-cta transition-colors py-4 hover:no-underline outline-none focus-visible:text-action-cta">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-xs md:text-sm leading-relaxed pb-5 max-w-3xl font-medium">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* --- BLOQUES DE AYUDA DIRECTA --- */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 md:p-8 rounded-sm bg-background border border-border/60 flex flex-col justify-between group hover:border-border transition-colors duration-200">
                    <div>
                        <MessageCircle className="text-muted-foreground/80 mb-4 group-hover:text-action-cta transition-colors" size={20} />
                        <H3 className="text-sm font-bold mb-2 tracking-tight">¿Aún tienes dudas?</H3>
                        <Muted className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
                            Nuestros especialistas en tecnología están listos para asesorarte de forma personalizada.
                        </Muted>
                    </div>
                    <Link
                        href="/hc/contacto-y-soporte"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-action-cta outline-none"
                    >
                        <span>Chatear ahora</span>
                        <ArrowRight size={12} className="transform transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="p-6 md:p-8 rounded-sm bg-background-secondary border border-border/60 flex flex-col justify-between">
                    <div>
                        <div className="text-foreground mb-4">
                            <HelpCircle size={20} />
                        </div>
                        <H3 className="text-sm font-bold mb-2 tracking-tight">Garantía GoPhone</H3>
                        <Muted className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">
                            Todos nuestros productos cuentan con respaldo oficial y garantía local en nuestras tiendas físicas.
                        </Muted>
                    </div>
                    <Link
                        href="/hc/garantias-y-devoluciones"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-action-cta transition-colors outline-none"
                    >
                        <span>Ver términos de garantía</span>
                        <ArrowRight size={12} />
                    </Link>
                </div>
            </div>
        </section>
    );
}