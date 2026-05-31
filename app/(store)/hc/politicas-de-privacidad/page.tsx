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
import { H1, H2, H3, Lead, Muted, Small } from "@/components/ui/Typography";

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
            title: "¿Para qué la utilizamos?",
            items: ["Procesar tus compras y pagos", "Coordinar envíos y entregas", "Brindarte soporte personalizado", "Enviar notificaciones sobre tu pedido", "Mejorar tu experiencia de compra"]
        },
        {
            icon: Eye,
            title: "Tus derechos",
            items: ["Acceder a tus datos personales", "Solicitar corrección o actualización", "Pedir la eliminación de tu información", "Retirar tu consentimiento"]
        }
    ];

    return (
        <section className="mx-auto px-4 py-12 md:py-16 select-none bg-background text-foreground">
            
            {/* --- CABECERA EDITORIAL --- */}
            <header className="mb-14 text-start">
                <div className="inline-flex items-center gap-2 border-l-2 border-action-cta pl-2.5 py-0.5 mb-5">
                    <Shield size={12} className="text-action-cta" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-action-cta">
                        Privacidad Garantizada
                    </span>
                </div>
                <H1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2">
                    Tu privacidad.
                </H1>
                <Lead className="text-lg md:text-2xl font-medium text-muted-foreground mb-4">
                    Nuestra responsabilidad.
                </Lead>
                <Muted className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed mt-4">
                    En GoPhone, protegemos tus datos personales bajo los más altos estándares de seguridad y transparencia, cumpliendo con la normativa vigente en Perú.
                </Muted>
            </header>

            <div className="grid gap-4">
                
                {/* --- BLOQUES DE INFORMACIÓN --- */}
                <div className="grid md:grid-cols-2 gap-4">
                    {secciones.map((sec, idx) => (
                        <div key={idx} className="bg-background border border-border/60 rounded-sm p-6 md:p-8">
                            <div className="w-8 h-8 rounded-sm bg-background-secondary border border-border flex items-center justify-center mb-5 text-muted-foreground/80">
                                <sec.icon size={16} />
                            </div>
                            <H3 className="text-sm font-bold mb-4 tracking-tight">
                                {sec.title}
                            </H3>
                            <ul className="space-y-2.5">
                                {sec.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                                        <div className="w-1 h-1 rounded-full bg-action-cta shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* --- BLOQUE: PROTECCIÓN DE DATOS (DESTACADO) --- */}
                    <div className="bg-background border border-border/60 rounded-sm p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <div className="w-8 h-8 rounded-sm bg-background-secondary border border-border flex items-center justify-center mb-5 text-action-cta">
                                <Lock size={16} />
                            </div>
                            <H3 className="text-sm font-bold mb-3 tracking-tight">Protección de datos</H3>
                            <Muted className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                                Implementamos medidas de seguridad avanzadas. Tus datos jamás serán vendidos ni compartidos con terceros, salvo para el procesamiento logístico de tus pedidos.
                            </Muted>
                        </div>
                        <div className="mt-6 text-action-cta text-[10px] font-bold uppercase tracking-wider">
                            Seguridad de nivel bancario
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN: CONTACTO --- */}
                <div className="mt-2 p-6 md:p-8 rounded-sm border border-border/60 bg-background-secondary">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-start">
                        <div>
                            <H2 className="text-base font-bold border-none pb-0 mb-1 tracking-tight">
                                Ejerce tus derechos
                            </H2>
                            <Muted className="text-xs text-muted-foreground font-medium">
                                ¿Deseas actualizar o eliminar tu información? Contáctanos.
                            </Muted>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                            <a href="mailto:contacto@gophone.pe" className="flex items-center justify-center gap-2 px-4 py-2 bg-background rounded-full border border-border text-[11px] font-bold text-foreground hover:bg-background-secondary transition-colors outline-none">
                                <Mail size={14} className="text-muted-foreground" />
                                contacto@gophone.pe
                            </a>
                            <Link href="/hc/contacto-y-soporte" className="flex items-center justify-center gap-1.5 px-4 py-2 bg-foreground text-background rounded-full text-[11px] font-bold hover:bg-action-cta hover:text-primary-foreground transition-colors outline-none">
                                <span>Centro de Soporte</span>
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="mt-16 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-8 py-3 bg-background-secondary text-foreground border border-border/60 rounded-full font-semibold text-xs hover:bg-background hover:border-muted-foreground/40 transition-colors outline-none"
                >
                    Volver al inicio
                </Link>
                <Small className="mt-6 text-[9px] text-muted-foreground/60 font-bold tracking-[0.2em] uppercase block">
                    GoPhone · Privacidad y Confianza
                </Small>
            </footer>
        </section>
    );
}