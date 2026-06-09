import { ShieldCheck, Undo2, PackageCheck, AlertCircle } from "lucide-react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import type { Metadata } from "next";
import { H1, H2, H3, Lead, Muted } from "@/components/ui/Typography";

export const metadata: Metadata = {
    title: "Garantías y Devoluciones | Gophone",
    description: "Consulta las políticas de garantías y devoluciones de Gophone. Conoce los plazos y requisitos.",
    alternates: { canonical: "https://gophone.pe/hc/garantias-y-devoluciones" },
};

export default function GarantiasDevolucionesPage() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-16 select-none bg-background text-foreground">
            
            {/* --- CABECERA EDITORIAL --- */}
            <header className="mb-14 text-start">
                <div className="inline-flex items-center gap-2 border-l-2 border-action-cta pl-2.5 py-0.5 mb-5">
                    <ShieldCheck size={12} className="text-action-cta" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-action-cta">
                        Compromiso de Calidad
                    </span>
                </div>
                <H1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2">
                    Garantía y Devoluciones.
                </H1>
                <Lead className="text-lg md:text-2xl font-medium text-muted-foreground mb-4">
                    Transparencia en cada paso.
                </Lead>
                <Muted className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed mt-4">
                    En GoPhone, tu tranquilidad es lo primero. Hemos diseñado nuestras políticas para proteger tu inversión y asegurar que siempre recibas lo mejor de la tecnología.
                </Muted>
            </header>

            <div className="grid gap-6">
                
                {/* --- SECCIÓN: DESISTIMIENTO --- */}
                <div className="bg-background border border-border/60 rounded-sm p-6 md:p-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-background-secondary border border-border flex items-center justify-center text-foreground">
                        <Undo2 size={18} />
                    </div>
                    <div className="flex-1">
                        <H2 className="text-xl font-bold border-none pb-0 mb-3 tracking-tight">
                            Derecho de Desistimiento
                        </H2>
                        <Muted className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
                            Tienes hasta <strong className="font-bold text-foreground">3 días hábiles</strong> tras la entrega para solicitar un cambio o devolución. Para que proceda, el producto debe estar totalmente nuevo, sellado en su empaque original y sin rastros de activación.
                        </Muted>
                        <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-sm border border-destructive/10">
                            <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                            <p className="text-[10px] font-bold text-destructive uppercase tracking-wider">
                                No aplica para productos usados, activados o con sellos rotos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN: CONDICIONES (GRID) --- */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-background border border-border/60 rounded-sm p-6 md:p-8">
                        <H3 className="text-sm font-bold mb-4 flex items-center gap-2 tracking-tight">
                            <PackageCheck className="text-action-cta" size={16} />
                            Requisitos básicos
                        </H3>
                        <ul className="space-y-3 text-xs md:text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <span className="text-action-cta">•</span>
                                Producto sin señales de uso o manipulación.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-action-cta">•</span>
                                Caja, sellos y accesorios originales al 100%.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-action-cta">•</span>
                                Presentar comprobante de pago.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-background border border-border/60 rounded-sm p-6 md:p-8">
                        <H3 className="text-sm font-bold mb-4 flex items-center gap-2 tracking-tight">
                            <ShieldCheck className="text-destructive" size={16} />
                            No están cubiertos
                        </H3>
                        <ul className="space-y-3 text-xs md:text-sm text-muted-foreground font-medium">
                            <li className="flex gap-2">
                                <span className="text-destructive">•</span>
                                Daños por caídas, humedad o sobrecargas eléctricas.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-destructive">•</span>
                                Equipos con manipulación de software no oficial.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-destructive">•</span>
                                Productos de higiene (como audífonos) abiertos.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- SECCIÓN: PROCESO --- */}
                <div className="bg-background border border-border/60 rounded-sm p-6 md:p-10">
                    <H2 className="text-xl font-bold border-none pb-0 mb-8 tracking-tight">
                        ¿Cómo iniciar el proceso?
                    </H2>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            "Contáctanos vía WhatsApp adjuntando fotos de tu pedido.",
                            "Evaluaremos técnicamente el producto (3-7 días hábiles).",
                            "Tras la validación, procesamos tu cambio o reembolso."
                        ].map((text, i) => (
                            <div key={i} className="space-y-1.5">
                                <span className="text-action-cta font-bold text-base">0{i + 1}</span>
                                <Muted className="text-xs text-muted-foreground leading-relaxed font-medium">{text}</Muted>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- SECCIÓN: CONTACTO --- */}
                <section className="mt-4 p-6 md:p-8 rounded-sm border border-border/60 bg-background-secondary flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <H3 className="text-base font-bold mb-1 tracking-tight">¿Necesitas asistencia?</H3>
                        <Muted className="text-xs text-muted-foreground font-medium">Nuestros especialistas responderán a la brevedad.</Muted>
                    </div>
                    
                    <div className="flex flex-wrap gap-2.5">
                        <a href="https://wa.me/51925054636" className="flex items-center gap-2 px-4 py-2 bg-background border border-border/80 rounded-full text-[11px] font-bold text-foreground hover:bg-background-secondary transition-colors outline-none">
                            <FaWhatsapp className="text-green-600" size={14} />
                            +51 925 054 636
                        </a>
                        <a href="mailto:contacto@gophone.pe" className="flex items-center gap-2 px-4 py-2 bg-background border border-border/80 rounded-full text-[11px] font-bold text-foreground hover:bg-background-secondary transition-colors outline-none">
                            <FaEnvelope className="text-muted-foreground" size={12} />
                            ventas@gophone.pe
                        </a>
                    </div>
                </section>
            </div>

          
        </section>
    );
}