"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import SliderCountdownTimer from "../ui/SliderCountdownTimer";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutCountdown({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, countdown, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    if (!countdown?.endsAt) return null;

    /* ─── Tokens de diseño estandarizados ────────────────────────── */
    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#ff375f" : "#ff2d55");

    /* ─── Función de animación consistente ──────────────────────── */
    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            className="group relative flex items-stretch w-full overflow-hidden h-[360px] sm:h-[460px] md:h-[600px]"
            style={{ backgroundColor: bg }}
        >
            {/* ════════════════════════════════════════════════════════
                MEDIA: Imagen con fusión adaptativa
            ════════════════════════════════════════════════════════ */}
            <div
                className="absolute inset-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[50%]"
                style={{
                    opacity:    loaded ? 1 : 0,
                    transform:  loaded ? "scale(1)" : "scale(1.05)",
                    transition: "opacity 1.2s ease, transform 1.4s cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-[2000ms] ease-out group-hover:scale-[1.04]`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority
                />
                
                {/* Overlay de gradiente para legibilidad (Mobile: Bottom, Desktop: Left) */}
                <div
                    className="absolute inset-0 pointer-events-none sm:hidden"
                    style={{
                        background: `linear-gradient(to top, ${bg} 10%, ${bg}b3 40%, transparent 100%)`,
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none hidden sm:block"
                    style={{
                        background: `linear-gradient(to left, transparent 0%, ${bg} 95%)`,
                    }}
                />
            </div>

            {/* ════════════════════════════════════════════════════════
                CONTENIDO: Panel informativo y Timer
            ════════════════════════════════════════════════════════ */}
            <div
                className="
                    relative z-10 
                    flex flex-col items-center justify-center text-center 
                    w-full px-6
                    sm:w-[55%] sm:items-start sm:text-left sm:pl-12 md:pl-20 lg:pl-32
                    gap-3 sm:gap-4
                "
                style={{ color: text }}
            >
                {/* Eyebrow / Badge */}
                {subtitle && (
                    <div style={fadeUp(0.1)}>
                        <span
                            className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase px-3 py-[5px] rounded-full"
                            style={{
                                color: accent,
                                background: `${accent}15`,
                                border: `1px solid ${accent}30`,
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {/* Título Responsivo */}
                {title && (
                    <h2
                        className="font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(1.8rem,5vw,3.8rem)] max-w-[15ch]"
                        style={fadeUp(0.2)}
                    >
                        {title}
                    </h2>
                )}

                {/* Descripción */}
                {description && (
                    <p
                        className="text-[12px] sm:text-[14px] leading-relaxed max-w-[35ch] line-clamp-2 sm:line-clamp-3"
                        style={{ color: muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                {/* CONTADOR (Timer) */}
                <div 
                    className="my-1 sm:my-2 w-full flex justify-center sm:justify-start"
                    style={fadeUp(0.4)}
                >
                    <SliderCountdownTimer
                        endsAt={countdown.endsAt}
                        label={countdown.label}
                        showDays={countdown.showDays}
                        theme={design.theme}
                        accentColor={accent}
                    />
                </div>

                {/* Precio y CTA unificado */}
                <div 
                    className="flex flex-col items-center sm:items-start gap-4 mt-2"
                    style={fadeUp(0.5)}
                >
                    {price?.current !== undefined && (
                        <SliderPrice price={price} />
                    )}

                    <span
                        className="
                            inline-flex items-center gap-2 
                            text-[13px] sm:text-[14px] font-semibold 
                            transition-all duration-300 group-hover:gap-3
                        "
                        style={{ color: accent }}
                    >
                        Ver oferta
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