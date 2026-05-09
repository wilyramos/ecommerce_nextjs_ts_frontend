"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutDefault({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    /* ─── Tokens de diseño estandarizados ────────────────────────── */
    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    /* ─── Función de animación consistente ──────────────────────── */
    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            className="group relative flex items-center w-full overflow-hidden h-[360px] sm:h-[460px] md:h-[600px]"
            style={{ backgroundColor: bg }}
        >
            {/* ════════════════════════════════════════════════════════
                FONDO: Gradiente radial sutil para dar profundidad
            ════════════════════════════════════════════════════════ */}
            <div
                className="absolute right-0 top-0 w-[70%] h-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 70% 50%, ${accent}12 0%, transparent 70%)`,
                }}
            />

            {/* ════════════════════════════════════════════════════════
                IMAGEN: Posicionada a la derecha con efecto flotante
            ════════════════════════════════════════════════════════ */}
            <div
                className="absolute right-0 top-0 h-full w-[50%] sm:w-[55%] pointer-events-none"
                style={{
                    opacity:    loaded ? 1 : 0,
                    transform:  loaded ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
                    transition: "opacity 1s ease 0.1s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
            >
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`
                        object-${media.objectFit ?? "contain"} 
                        drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                        transition-transform duration-[2000ms] ease-out
                        group-hover:scale-[1.03]
                    `}
                    sizes="50vw"
                    priority
                />
            </div>

            {/* ════════════════════════════════════════════════════════
                CONTENIDO: Panel de texto a la izquierda
            ════════════════════════════════════════════════════════ */}
            <div 
                className="
                    relative z-10 
                    flex flex-col 
                    pl-7 sm:pl-12 md:pl-20 lg:pl-32 
                    w-full max-w-[60%] sm:max-w-[55%] 
                    gap-2 sm:gap-4
                "
                style={{ color: text }}
            >
                {/* Eyebrow / Subtitle */}
                {subtitle && (
                    <div style={fadeUp(0.1)}>
                        <span 
                            className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase"
                            style={{ color: accent }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {/* Título - Impacto visual con clamp */}
                {title && (
                    <h2 
                        className="font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(1.8rem,5vw,4.2rem)] max-w-[12ch]"
                        style={fadeUp(0.2)}
                    >
                        {title}
                    </h2>
                )}

                {/* Línea decorativa minimalista */}
                <div 
                    className="h-[2px] w-10 sm:w-14 rounded-full"
                    style={{ 
                        background: accent,
                        opacity: loaded ? 0.8 : 0,
                        transition: "opacity 0.5s ease 0.3s"
                    }}
                />

                {/* Descripción */}
                {description && (
                    <p 
                        className="text-[12px] sm:text-[14px] md:text-[16px] leading-relaxed max-w-[32ch] line-clamp-3"
                        style={{ color: muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                {/* Precio */}
                {price?.current !== undefined && (
                    <div style={fadeUp(0.4)}>
                        <SliderPrice price={price} />
                    </div>
                )}

                {/* CTA Botón / Link */}
                <div style={fadeUp(0.5)} className="mt-2">
                    <span 
                        className="
                            inline-flex items-center gap-2 
                            text-[13px] sm:text-[14px] font-semibold 
                            transition-all duration-300 group-hover:gap-3
                        "
                        style={{ color: accent }}
                    >
                        Ver detalles
                        <svg 
                            width="16" height="16" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            <path d="M5 12h14m-7-7 7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}