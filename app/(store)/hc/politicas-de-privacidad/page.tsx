import type { Metadata } from "next";
import {
    Shield,
    User,
    Lock,
    Mail,
    Eye,
    FileCheck,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Políticas de Privacidad | Gophone Perú",
    description: "Conoce cómo Gophone recopila, utiliza y protege tu información personal con total transparencia.",
    alternates: { canonical: "https://gophone.pe/hc/politicas-de-privacidad" },
};

export default function PoliticasPrivacidadPage() {
    const secciones = [
        {
            icon: User,
            title: "Información que recopilamos",
            items: ["Nombre y apellidos", "Correo electrónico", "Número de teléfono", "Dirección de envío", "Historial de compras"]
        },
        {
            icon: FileCheck,
            title: "¿Para qué utilizamos tu información?",
            items: ["Procesar tus compras y pagos", "Coordinar envíos y entregas", "Brindarte soporte personalizado", "Enviar notificaciones sobre tu pedido", "Mejorar tu experiencia de compra"]
        },
        {
            icon: Eye,
            title: "Tus derechos",
            items: ["Acceder a tus datos personales", "Solicitar corrección o actualización", "Pedir la eliminación de tu información", "Retirar tu consentimiento"]
        }
    ];

    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            
            {/* --- CABECERA EDITORIAL --- */}
            <header className="mb-16 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)] text-[10px] font-bold uppercase tracking-widest mb-6">
                    <Shield size={14} />
                    <span>Privacidad Garantizada</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--store-text)] tracking-tight mb-4 leading-[1.1]">
                    Tu privacidad. <br />
                    <span className="text-[var(--store-text-muted)] text-2xl md:text-3xl font-medium">Nuestra responsabilidad.</span>
                </h1>
                <p className="text-lg text-[var(--store-text-muted)] max-w-2xl leading-relaxed mt-6 font-medium">
                    En GoPhone, protegemos tus datos personales bajo los más altos estándares de seguridad y transparencia, cumpliendo con la normativa vigente en Perú.
                </p>
            </header>

            <div className="grid gap-12">
                
                {/* --- BLOQUES DE INFORMACIÓN --- */}
                <div className="grid md:grid-cols-2 gap-8">
                    {secciones.map((sec, idx) => (
                        <div key={idx} className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] p-8 md:p-10 shadow-sm group hover:border-[var(--store-primary)]/30 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[var(--store-bg)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <sec.icon className="text-[var(--store-text)]" size={22} />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--store-text)] mb-4 tracking-tight">
                                {sec.title}
                            </h2>
                            <ul className="space-y-3">
                                {sec.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--store-text-muted)] font-medium">
                                        <div className="w-1 h-1 rounded-full bg-[var(--store-primary)]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* --- BLOQUE: PROTECCIÓN DE DATOS (DESTACADO) --- */}
                    <div className="bg-[var(--store-text)] text-[var(--store-surface)] rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-[var(--store-primary)]">
                                <Lock size={22} />
                            </div>
                            <h2 className="text-xl font-bold mb-4 tracking-tight">Protección de datos</h2>
                            <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                Implementamos medidas de seguridad avanzadas. Tus datos jamás serán vendidos ni compartidos con terceros, salvo para el procesamiento logístico de tus pedidos.
                            </p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-[var(--store-primary)] text-xs font-bold uppercase tracking-widest">
                            Seguridad de nivel bancario
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN: CONTACTO --- */}
                <div className="mt-8 p-10 rounded-[2.5rem] border border-[var(--store-border)] bg-[var(--store-bg)]">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div>
                            <h3 className="text-2xl font-bold text-[var(--store-text)] mb-2 tracking-tight">Ejerce tus derechos</h3>
                            <p className="text-[var(--store-text-muted)] text-sm font-medium">¿Deseas actualizar o eliminar tu información? Contáctanos.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="mailto:contacto@gophone.pe" className="flex items-center gap-3 px-6 py-3 bg-[var(--store-surface)] rounded-full border border-[var(--store-border)] text-[13px] font-bold text-[var(--store-text)] hover:shadow-md transition-all">
                                <Mail size={16} />
                                contacto@gophone.pe
                            </a>
                            <Link href="/hc/contacto-y-soporte" className="flex items-center gap-2 px-6 py-3 bg-[var(--store-primary)] text-white rounded-full text-[13px] font-bold hover:bg-[var(--store-primary-hover)] transition-all">
                                Centro de Soporte <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="mt-24 text-center">
                <p className="text-[10px] text-[var(--store-text-muted)] font-bold tracking-[0.25em] uppercase mb-8">
                    GoPhone · Privacidad y Confianza
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 bg-[var(--store-surface)] text-[var(--store-text)] border border-[var(--store-border)] rounded-full font-semibold text-sm hover:bg-[var(--store-bg)] transition-all active:scale-95"
                >
                    Volver al inicio
                </Link>
            </footer>
        </section>
    );
}