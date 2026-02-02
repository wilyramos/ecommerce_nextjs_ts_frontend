import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";

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
            question: "¿Qué hago si mi producto llega con daños estéticos o de fábrica?",
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
            question: "¿Cuál es el horario de atención en tiendas?",
            answer: "Nuestro equipo de soporte está disponible de Lunes a Sábado de 10:00 am a 7:00 pm. Fuera de ese horario, puedes dejarnos un mensaje por WhatsApp y te contactaremos a primera hora."
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- HEADER EDITORIAL --- */}
            <header className="mb-16 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)] text-[10px] font-bold uppercase tracking-widest mb-6">
                    <HelpCircle size={14} />
                    <span>Centro de Soporte</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--store-text)] tracking-tight mb-4">
                    Preguntas frecuentes. <br />
                    <span className="text-[var(--store-text-muted)] text-3xl md:text-4xl">Todo lo que necesitas saber.</span>
                </h1>
            </header>

            {/* --- CONTENEDOR DE ACORDEÓN --- */}
            <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] p-6 md:p-10 shadow-sm overflow-hidden">
                <Accordion type="single" collapsible className="w-full border-none">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-b border-[var(--store-border)] last:border-0 py-2"
                        >
                            <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-[var(--store-text)] hover:text-[var(--store-primary)] transition-colors py-6 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[var(--store-text-muted)] text-sm md:text-base leading-relaxed pb-8 max-w-3xl">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* --- BLOQUE DE AYUDA DIRECTA --- */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-[var(--store-bg)] border border-[var(--store-border)] flex flex-col justify-between group hover:border-[var(--store-primary)]/30 transition-all">
                    <div>
                        <MessageCircle className="text-[var(--store-primary)] mb-4" size={28} />
                        <h3 className="text-lg font-bold text-[var(--store-text)] mb-2">¿Aún tienes dudas?</h3>
                        <p className="text-sm text-[var(--store-text-muted)] leading-relaxed mb-6">
                            Nuestros especialistas en tecnología están listos para asesorarte de forma personalizada.
                        </p>
                    </div>
                    <Link
                        href="/hc/contacto-y-soporte"
                        className="flex items-center gap-2 text-sm font-bold text-[var(--store-primary)] group-hover:gap-3 transition-all"
                    >
                        Chatear ahora <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="p-8 rounded-[2rem] bg-[var(--store-text)] text-[var(--store-surface)] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold mb-2">Garantía GoPhone</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Todos nuestros productos cuentan con respaldo oficial y garantía local en nuestras tiendas físicas.
                        </p>
                    </div>
                    <Link
                        href="/hc/garantias-y-devoluciones"
                        className="flex items-center gap-2 text-sm font-bold text-[var(--store-surface)] hover:text-[var(--store-primary)] transition-colors"
                    >
                        Ver términos de garantía <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* --- FOOTER CTA --- */}
            <footer className="mt-24 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 bg-[var(--store-primary)] text-white rounded-full font-semibold text-sm hover:bg-[var(--store-primary-hover)] transition-all active:scale-95 shadow-lg shadow-blue-500/10"
                >
                    Seguir comprando
                </Link>
                <p className="mt-8 text-[10px] text-[var(--store-text-muted)] font-bold tracking-[0.2em] uppercase">
                    GoPhone · Cañete · Perú
                </p>
            </footer>
        </section>
    );
}