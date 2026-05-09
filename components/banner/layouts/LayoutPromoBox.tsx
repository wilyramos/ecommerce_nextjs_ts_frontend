"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

/**
 * LayoutPromoBox: Rediseño enfocado en un concepto de "Product Showcase" 
 * con profundidad, texturas y un enfoque tipográfico premium.
 */
export default function LayoutPromoBox({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#0d0d0d" : "#f4f4f2");
    const accent = design.accentColor ?? (isDark ? "#f97316" : "#e55a00");
    const text = design.textColor ?? (isDark ? "#f0f0ef" : "#111110");
    const muted = design.textMutedColor ?? (isDark ? "#888" : "#777");

    const cardBg = isDark ? "#111111" : "#ffffff";
    const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(20px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative flex items-center justify-center w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Fondo Atmosférico: Noise + Gradientes ── */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            

            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-12 py-10 md:py-0">

                {/* ── Bloque de Información (The "Box" Content) ── */}
                <div
                    className="relative flex-shrink-0 w-full max-w-[340px] md:max-w-[380px] lg:max-w-[420px] z-20"
                    style={fadeUp(0.1)}
                >
                    <div
                        className="relative p-8 md:p-10 overflow-hidden"
                        style={{
                            backgroundColor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            boxShadow: isDark
                                ? "0 40px 80px -20px rgba(0,0,0,0.8)"
                                : "0 40px 80px -20px rgba(0,0,0,0.15)"
                        }}
                    >
                        {/* Acento decorativo esquinero */}
                        <div
                            className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2"
                            style={{ borderColor: accent }}
                        />

                        <div className="flex flex-col gap-6">
                            {subtitle && (
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-px bg-current" style={{ color: accent }} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: accent }}>
                                        {subtitle}
                                    </span>
                                </div>
                            )}

                            {title && (
                                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-[1.1] tracking-tight" style={{ color: text }}>
                                    {title}
                                </h2>
                            )}

                            {description && (
                                <p className="text-sm leading-relaxed opacity-80" style={{ color: muted }}>
                                    {description}
                                </p>
                            )}

                            {price?.current !== undefined && (
                                <div className="pt-4 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40" style={{ color: text }}>
                                        Precio exclusivo
                                    </span>
                                    <SliderPrice price={price} />
                                </div>
                            )}

                            {/* Botón Simulado (CTA) */}
                            <div className="pt-4">
                                <div
                                    className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all duration-300 group-hover:gap-5"
                                    style={{ borderColor: accent, color: text }}
                                >
                                    Descubrir
                                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 1L17 6L12 11M1 6H17H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Elemento decorativo flotante detrás de la card */}
                    <div
                        className="absolute -bottom-4 -right-4 w-full h-full -z-10 border opacity-20"
                        style={{ borderColor: accent }}
                    />
                </div>

                {/* ── Visual Showcase (The Media) ── */}
                <div
                    className="relative flex-1 w-full h-[350px] md:h-[80%] flex items-center justify-center"
                    style={fadeUp(0.2)}
                >
                    {/* Anillo decorativo rotatorio en hover */}
                    <div
                        className="absolute w-[80%] aspect-square border rounded-full opacity-[0.05] transition-transform duration-[2000ms] group-hover:rotate-180"
                        style={{ borderColor: text }}
                    />

                    <div className="relative w-full h-full z-10 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                        <ImageBorder
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            objectFit={media.objectFit ?? "contain"}
                            borderStyle={media.border ?? "none"}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                            className="drop-shadow-[0_30px_60px_rgba(0,0,0,0.25)]"
                        />
                    </div>

                    {/* Sombra de base */}
                    <div
                        className="absolute bottom-[10%] w-[60%] h-10 bg-black/20 blur-2xl rounded-[100%] transition-opacity duration-700 group-hover:opacity-40"
                    />
                </div>
            </div>


        </Link>
    );
}