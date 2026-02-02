import { ShieldCheck, Undo2, PackageCheck, AlertCircle } from "lucide-react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Garantías y Devoluciones | Gophone",
    description: "Consulta las políticas de garantías y devoluciones de Gophone. Conoce los plazos y requisitos.",
    alternates: { canonical: "https://gophone.pe/hc/garantias-y-devoluciones" },
};

export default function GarantiasDevolucionesPage() {
    return (
        <section className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            
            {/* --- CABECERA EDITORIAL --- */}
            <header className="mb-16 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)] text-[10px] font-bold uppercase tracking-widest mb-6">
                    <ShieldCheck size={14} />
                    <span>Compromiso de Calidad</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--store-text)] tracking-tight mb-4 leading-[1.1]">
                    Garantía y Devoluciones. <br />
                    <span className="text-[var(--store-text-muted)] text-2xl md:text-3xl font-medium">Transparencia en cada paso.</span>
                </h1>
                <p className="text-lg text-[var(--store-text-muted)] max-w-2xl leading-relaxed mt-6">
                    En GoPhone, tu tranquilidad es lo primero. Hemos diseñado nuestras políticas para proteger tu inversión y asegurar que siempre recibas lo mejor de la tecnología.
                </p>
            </header>

            <div className="grid gap-8">
                
                {/* --- SECCIÓN: DESISTIMIENTO --- */}
                <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[var(--store-bg)] flex items-center justify-center text-[var(--store-text)]">
                        <Undo2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--store-text)] mb-4 tracking-tight">Derecho de Desistimiento</h2>
                        <p className="text-[var(--store-text-muted)] leading-relaxed mb-6">
                            Tienes hasta <strong>3 días hábiles</strong> tras la entrega para solicitar un cambio o devolución. Para que proceda, el producto debe estar totalmente nuevo, sellado en su empaque original y sin rastros de activación.
                        </p>
                        <div className="flex items-center gap-2 p-4 bg-[#FF3B30]/5 rounded-2xl border border-[#FF3B30]/10">
                            <AlertCircle className="w-4 h-4 text-[#FF3B30] flex-shrink-0" />
                            <p className="text-[11px] font-semibold text-[#FF3B30] uppercase tracking-wider">
                                No aplica para productos usados, activados o con sellos rotos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN: CONDICIONES (GRID) --- */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] p-8">
                        <h3 className="text-lg font-bold text-[var(--store-text)] mb-6 flex items-center gap-2 tracking-tight">
                            <PackageCheck className="text-[var(--store-primary)]" size={20} />
                            Requisitos básicos
                        </h3>
                        <ul className="space-y-4 text-sm text-[var(--store-text-muted)] font-medium">
                            <li className="flex gap-3">
                                <span className="text-[var(--store-primary)]">•</span>
                                Producto sin señales de uso o manipulación.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--store-primary)]">•</span>
                                Caja, sellos y accesorios originales al 100%.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--store-primary)]">•</span>
                                Presentar comprobante de pago.
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[var(--store-surface)] border border-[var(--store-border)] rounded-[2.5rem] p-8">
                        <h3 className="text-lg font-bold text-[var(--store-text)] mb-6 flex items-center gap-2 tracking-tight">
                            <ShieldCheck className="text-[#FF3B30]" size={20} />
                            No están cubiertos
                        </h3>
                        <ul className="space-y-4 text-sm text-[var(--store-text-muted)] font-medium">
                            <li className="flex gap-3">
                                <span className="text-[#FF3B30]">•</span>
                                Daños por caídas, humedad o sobrecargas eléctricas.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#FF3B30]">•</span>
                                Equipos con manipulación de software no oficial.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#FF3B30]">•</span>
                                Productos de higiene (como audífonos) abiertos.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- SECCIÓN: PROCESO --- */}
                <div className="bg-[var(--store-text)] text-[var(--store-surface)] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-10 tracking-tight">¿Cómo iniciar el proceso?</h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                "Contáctanos vía WhatsApp adjuntando fotos de tu pedido.",
                                "Evaluaremos técnicamente el producto (3-7 días hábiles).",
                                "Tras la validación, procesamos tu cambio o reembolso."
                            ].map((text, i) => (
                                <div key={i} className="space-y-3">
                                    <span className="text-[var(--store-primary)] font-mono font-bold text-xl">0{i + 1}</span>
                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN: CONTACTO --- */}
                <section className="mt-12 p-8 md:p-10 rounded-[2.5rem] border border-[var(--store-border)] bg-[var(--store-bg)] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-[var(--store-text)] mb-2 tracking-tight">¿Necesitas asistencia?</h3>
                        <p className="text-[var(--store-text-muted)] text-sm font-medium">Nuestros especialistas responderán a la brevedad.</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://wa.me/51925054636" className="flex items-center gap-2 px-5 py-2.5 bg-[var(--store-surface)] rounded-full border border-[var(--store-border)] text-xs font-bold text-[var(--store-text)] hover:shadow-md transition-all">
                            <FaWhatsapp className="text-green-600" size={16} />
                            +51 925 054 636
                        </a>
                        <a href="mailto:contacto@gophone.pe" className="flex items-center gap-2 px-5 py-2.5 bg-[var(--store-surface)] rounded-full border border-[var(--store-border)] text-xs font-bold text-[var(--store-text)] hover:shadow-md transition-all">
                            <FaEnvelope size={14} />
                            ventas@gophone.pe
                        </a>
                    </div>
                </section>
            </div>

            <footer className="mt-24 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center px-10 py-4 bg-[var(--store-primary)] text-white rounded-full font-semibold text-sm hover:bg-[var(--store-primary-hover)] transition-all active:scale-95 shadow-lg shadow-blue-500/10"
                >
                    Volver a la tienda
                </Link>
                <p className="mt-8 text-[10px] text-[var(--store-text-muted)] font-bold tracking-[0.25em] uppercase">
                    GoPhone · San Vicente de Cañete
                </p>
            </footer>
        </section>
    );
}