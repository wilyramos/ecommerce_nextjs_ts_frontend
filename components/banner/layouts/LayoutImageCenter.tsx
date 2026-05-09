"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageCenter({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark  = design.theme !== "light";
    const bg      = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text    = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted   = design.textMutedColor ?? (isDark ? "#999"    : "#6e6e73");
    const accent  = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    /* ─── Animación staggered ───────────────────────────────────── */
    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(16px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    /* ─── Intensidad del velo según objectFit ───────────────────── */
    const imgOpacity = media.objectFit === "contain" ? 0.9 : 1;

    return (
        <Link
            href={destUrl}
            className="group relative flex w-full overflow-hidden"
            style={{
                backgroundColor: bg,
                minHeight: "clamp(340px, 54vw, 680px)",
            }}
        >

            {/* ════════════════════════════════════════════════════════
                IMAGEN — sangra todo el banner, zoom suave en hover
            ════════════════════════════════════════════════════════ */}
            <Image
                src={media.imageUrl}
                alt={media.altText}
                fill
                sizes="100vw"
                className={`
                    object-${media.objectFit ?? "cover"}
                    transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                    group-hover:scale-[1.05]
                `}
                style={{ opacity: imgOpacity }}
                priority
            />

            {/* ════════════════════════════════════════════════════════
                CAPAS DE GRADIENTE
                1. Viñeta perimetral — oscurece bordes, deja centro limpio
                2. Rampa inferior — zona de texto siempre legible
            ════════════════════════════════════════════════════════ */}

            {/* Viñeta perimetral */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse 80% 75% at 50% 50%,
                              transparent 20%,
                              ${bg}55 65%,
                              ${bg}cc 100%)`
                        : `radial-gradient(ellipse 80% 75% at 50% 50%,
                              transparent 20%,
                              ${bg}44 65%,
                              ${bg}bb 100%)`,
                }}
            />

            {/* Rampa inferior — garantiza legibilidad del texto */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none"
                style={{
                    height: "65%",
                    background: isDark
                        ? `linear-gradient(to top, ${bg}f2 0%, ${bg}bb 35%, transparent 100%)`
                        : `linear-gradient(to top, ${bg}f0 0%, ${bg}aa 35%, transparent 100%)`,
                }}
            />

            {/* ════════════════════════════════════════════════════════
                CONTENIDO — anclado al tercio inferior del banner
                  • Mobile  : padding generoso desde abajo
                  • Desktop : centrado vertical con pb extra en parte baja
            ════════════════════════════════════════════════════════ */}
            <div className="
                relative z-10 w-full
                flex flex-col items-center justify-end text-center
                px-6 pb-10
                sm:px-10 sm:pb-12
                md:justify-center md:pb-0
                md:px-12
            ">
                <div
                    className="
                        flex flex-col items-center
                        w-full
                        max-w-[20rem] sm:max-w-[34rem] md:max-w-2xl lg:max-w-3xl
                        /* En desktop baja el bloque al 60% vertical */
                        md:translate-y-[10%]
                    "
                    style={{ color: text }}
                >

                    {/* Eyebrow — píldora con accent */}
                    {subtitle && (
                        <div className="mb-3 md:mb-4" style={fadeUp(0.08)}>
                            <span
                                className="
                                    inline-block text-[10px] font-bold
                                    tracking-[0.32em] uppercase
                                    px-3 py-[5px] rounded-full
                                "
                                style={{
                                    color:      accent,
                                    background: `${accent}20`,
                                    border:     `1px solid ${accent}35`,
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {/* Título — protagonista absoluto */}
                    {title && (
                        <h2
                            className="
                                font-semibold leading-[1.03] tracking-[-0.04em]
                                text-[clamp(2.1rem,6.8vw,5rem)]
                                mb-0
                            "
                            style={fadeUp(0.15, {
                                transform: loaded
                                    ? "translateY(0px) scale(1)"
                                    : "translateY(18px) scale(0.96)",
                                transition: `opacity 0.8s ease 0.15s,
                                             transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s`,
                            })}
                        >
                            {title}
                        </h2>
                    )}

                    {/* Descripción — aparece solo si hay título */}
                    {description && (
                        <p
                            className="
                                mt-3 md:mt-4
                                text-[12px] sm:text-[13px] md:text-[14px]
                                leading-[1.75] max-w-[34ch] line-clamp-2
                            "
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {/* Precio */}
                    {price?.current !== undefined && (
                        <div className="mt-3 md:mt-4" style={fadeUp(0.36)}>
                            <SliderPrice price={price} />
                        </div>
                    )}

                    {/* Separador + CTA */}
                    <div
                        className="mt-5 md:mt-6 flex flex-col items-center gap-3"
                        style={fadeUp(0.44)}
                    >
                        {/* Línea separadora */}
                        <div
                            className="w-8 h-px rounded-full"
                            style={{ background: `${accent}80` }}
                        />

                        {/* CTA */}
                        <span
                            className="
                                inline-flex items-center gap-[7px]
                                text-[13px] font-semibold tracking-wide
                                transition-all duration-300 ease-out
                                group-hover:gap-[11px]
                            "
                            style={{ color: accent }}
                        >
                            Ver más
                            <svg
                                width="14" height="14" viewBox="0 0 14 14" fill="none"
                                className="transition-transform duration-300 group-hover:translate-x-[3px]"
                            >
                                <path
                                    d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
                                    stroke="currentColor" strokeWidth="1.6"
                                    strokeLinecap="round" strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

        </Link>
    );
}