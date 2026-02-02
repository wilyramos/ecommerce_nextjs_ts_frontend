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
            color: "text-[var(--store-primary)]"
        },
        {
            title: "Ubicación",
            value: "Jr. O Higgins 120",
            description: "San Vicente de Cañete, Perú.",
            href: "#",
            icon: MapPin,
            color: "text-red-500"
        },
        {
            title: "Horario",
            value: "Lun–Sáb 10am – 7pm",
            description: "Atención personalizada.",
            icon: Clock,
            color: "text-[var(--store-text)]"
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* --- HEADER EDITORIAL --- */}
            <header className="mb-16 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)] text-[10px] font-bold uppercase tracking-widest mb-6">
                    <MessageSquare size={14} />
                    <span>Centro de Ayuda</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--store-text)] tracking-tight mb-4 leading-[1.1]">
                    Estamos aquí para <br className="hidden md:block" /> ayudarte.
                </h1>
                <p className="text-lg text-[var(--store-text-muted)] max-w-2xl leading-relaxed mt-4">
                    Ya sea una duda técnica o una consulta sobre tu pedido, nuestro equipo de especialistas está listo para asistirte.
                </p>
            </header>

            {/* --- GRID DE CONTACTO --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                {contactMethods.map((method, index) => (
                    <div
                        key={index}
                        className="p-8 rounded-[2rem] bg-[var(--store-surface)] border border-[var(--store-border)] shadow-sm hover:border-[var(--store-primary)] transition-all duration-300 group"
                    >
                        <method.icon className={`${method.color} mb-6 transition-transform group-hover:scale-110`} size={28} />
                        <h3 className="text-sm font-bold text-[var(--store-text-muted)] uppercase tracking-wider mb-2">
                            {method.title}
                        </h3>
                        {method.href ? (
                            <a href={method.href} className="text-lg font-bold text-[var(--store-text)] hover:text-[var(--store-primary)] transition-colors block mb-1">
                                {method.value}
                            </a>
                        ) : (
                            <p className="text-lg font-bold text-[var(--store-text)] mb-1">
                                {method.value}
                            </p>
                        )}
                        <p className="text-sm text-[var(--store-text-muted)]">
                            {method.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* --- FORMULARIO Y SOPORTE --- */}
            <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] overflow-hidden shadow-sm grid md:grid-cols-12">

                {/* Lateral Informativo */}
                <div className="md:col-span-5 bg-[var(--store-text)] p-10 text-[var(--store-surface)] flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-6">Envíanos un mensaje directo</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            ¿Prefieres el correo? Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas hábiles.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--store-primary)] mb-4">Preguntas rápidas</p>
                        <Link href="/hc/preguntas-frecuentes" className="text-sm font-medium flex items-center gap-2 hover:underline">
                            Ir a FAQs <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Formulario */}
                <div className="md:col-span-7 p-10 bg-[var(--store-surface)]">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--store-text-muted)] ml-1">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Tu nombre"
                                    className="w-full bg-[var(--store-bg)] border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[var(--store-primary)] transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--store-text-muted)] ml-1">Email</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-[var(--store-bg)] border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[var(--store-primary)] transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--store-text-muted)] ml-1">Mensaje</label>
                            <textarea
                                rows={4}
                                placeholder="¿En qué podemos ayudarte hoy?"
                                className="w-full bg-[var(--store-bg)] border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-[var(--store-primary)] transition-all outline-none resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[var(--store-primary)] text-white py-4 rounded-full flex items-center justify-center gap-2 text-sm font-bold hover:bg-[var(--store-primary-hover)] transition-all active:scale-[0.98]"
                        >
                            Enviar mensaje
                            <SendHorizontal size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <footer className="mt-20 text-center">
                <p className="text-[10px] text-[var(--store-text-muted)] font-bold tracking-[0.25em] uppercase mb-8">
                    GoPhone · San Vicente de Cañete
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 bg-[var(--store-surface)] text-[var(--store-text)] border border-[var(--store-border)] rounded-full font-semibold text-sm hover:bg-[var(--store-bg)] transition-all active:scale-95"
                >
                    Volver a la tienda
                </Link>
            </footer>
        </section>
    );
}