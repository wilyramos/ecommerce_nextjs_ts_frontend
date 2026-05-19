"use client";

import {
    Mail,
    MapPin,
    MessageSquare,
    Clock,
    SendHorizontal,
    ArrowRight
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { H1, H3, Lead, Muted, Small } from "@/components/ui/Typography";

export default function ContactoSoportePage() {
    const contactMethods = [
        {
            title: "WhatsApp",
            value: "+51 925 054 636",
            description: "Respuesta inmediata por chat.",
            href: "https://wa.me/51925054636",
            icon: FaWhatsapp,
            color: "text-green-600"
        },
        {
            title: "Email",
            value: "contacto@gophone.pe",
            description: "Consultas técnicas y ventas.",
            href: "mailto:contacto@gophone.pe",
            icon: Mail,
            color: "text-action-cta"
        },
        {
            title: "Ubicación",
            value: "Jr. O Higgins 120",
            description: "San Vicente de Cañete, Perú.",
            href: "#",
            icon: MapPin,
            color: "text-muted-foreground"
        },
        {
            title: "Horario",
            value: "Lun–Sáb 10am – 7pm",
            description: "Atención personalizada.",
            icon: Clock,
            color: "text-muted-foreground"
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 select-none bg-background text-foreground">

            {/* --- HEADER EDITORIAL --- */}
            <header className="mb-14 text-start">
                <div className="inline-flex items-center gap-2 border-l-2 border-action-cta pl-2.5 py-0.5 mb-5">
                    <MessageSquare size={12} className="text-action-cta" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-action-cta">
                        Centro de Ayuda
                    </span>
                </div>
                <H1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">
                    Estamos aquí para <br className="hidden md:block" /> ayudarte.
                </H1>
                <Lead className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
                    Ya sea una duda técnica o una consulta sobre tu pedido, nuestro equipo de especialistas está listo para asistirte.
                </Lead>
            </header>

            {/* --- GRID DE CONTACTO --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
                {contactMethods.map((method, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-sm bg-background border border-border/60 hover:border-border transition-colors duration-200"
                    >
                        <method.icon className={`${method.color} mb-4`} size={20} />
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {method.title}
                        </h3>
                        {method.href ? (
                            <a href={method.href} className="text-[15px] font-semibold text-foreground hover:text-action-cta transition-colors inline-block mb-1 outline-none">
                                {method.value}
                            </a>
                        ) : (
                            <p className="text-[15px] font-semibold text-foreground mb-1">
                                {method.value}
                            </p>
                        )}
                        <Muted className="text-xs text-muted-foreground/80 leading-normal">
                            {method.description}
                        </Muted>
                    </div>
                ))}
            </div>

            {/* --- FORMULARIO Y SOPORTE --- */}
            <div className="bg-background border border-border/60 rounded-sm overflow-hidden grid md:grid-cols-12">

                {/* Lateral Informativo */}
                <div className="md:col-span-5 bg-background-secondary p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/60">
                    <div>
                        <H3 className="text-lg font-bold tracking-tight mb-4">Envíanos un mensaje directo</H3>
                        <Muted className="text-xs text-muted-foreground leading-relaxed">
                            ¿Prefieres el correo? Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas hábiles.
                        </Muted>
                    </div>
                    <div className="mt-8 pt-6 border-t border-border/60">
                        <Small className="text-[9px] font-bold uppercase tracking-[0.15em] text-action-cta mb-2 block">
                            Preguntas rápidas
                        </Small>
                        <Link href="/hc/preguntas-frecuentes" className="text-xs font-semibold flex items-center gap-1.5 text-foreground hover:text-action-cta transition-colors outline-none">
                            Ir a FAQs <ArrowRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Formulario */}
                <div className="md:col-span-7 p-8 bg-background">
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full bg-background-secondary border border-border/40 rounded-sm px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:border-muted-foreground/60 transition-colors outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Email</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-background-secondary border border-border/40 rounded-sm px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:border-muted-foreground/60 transition-colors outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-0.5">Mensaje</label>
                            <textarea
                                rows={4}
                                placeholder="¿En qué podemos ayudarte hoy?"
                                className="w-full bg-background-secondary border border-border/40 rounded-sm px-4 py-3 text-xs text-foreground placeholder-muted-foreground/50 focus:border-muted-foreground/60 transition-colors outline-none resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-foreground text-background py-3 rounded-full flex items-center justify-center gap-2 text-xs font-bold hover:bg-action-cta hover:text-primary-foreground transition-colors outline-none"
                        >
                            <span>Enviar mensaje</span>
                            <SendHorizontal size={14} />
                        </button>
                    </form>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="mt-16 text-center">
                <p className="text-[9px] text-muted-foreground/60 font-bold tracking-[0.2em] uppercase mb-6">
                    GoPhone · San Vicente de Cañete
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-background-secondary text-foreground border border-border/60 rounded-full font-semibold text-xs hover:bg-background hover:border-muted-foreground/40 transition-colors outline-none"
                >
                    Volver a la tienda
                </Link>
            </footer>
        </section>
    );
}