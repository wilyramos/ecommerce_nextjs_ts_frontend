"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageLeft({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 60);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#0a0a0a" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#888888" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    /* ─── Helpers de animación staggered ─────────────────────────── */
    const fadeUp = (delay: number) => ({
        opacity:   loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            className="group relative w-full overflow-hidden block"
            style={{ backgroundColor: bg }}
        >
           
            <div className="flex flex-col md:grid md:grid-cols-[58fr_42fr] md:items-stretch">

                {/* ── Columna imagen ──────────────────────────────────── */}
                <div
                    className="relative w-full overflow-hidden"
                    style={{ height: "clamp(220px, 46vw, 620px)" }}
                >
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className={`
                            object-${media.objectFit ?? "cover"}
                            transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                            group-hover:scale-[1.04]
                        `}
                        priority
                    />

                    {/* Fade derecho — funde imagen con el panel de texto (solo desktop) */}
                    <div
                        className="absolute inset-y-0 right-0 w-28 hidden md:block pointer-events-none"
                        style={{ background: `linear-gradient(to right, transparent, ${bg})` }}
                    />

                    {/* Velo inferior — solo mobile, suaviza la unión con el texto */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-2/5 md:hidden pointer-events-none"
                        style={{ background: `linear-gradient(to top, ${bg}, transparent)` }}
                    />
                </div>

                {/* ── Columna texto ───────────────────────────────────── */}
                <div
                    className="
                        relative z-10
                        flex flex-col justify-center
                        -mt-8 px-6 pb-9
                        sm:-mt-10 sm:px-9 sm:pb-11
                        md:mt-0 md:px-10 md:py-14
                        lg:px-14 lg:py-16
                        xl:px-16
                    "
                    style={{ color: text }}
                >
                    {/* Eyebrow / subtítulo */}
                    {subtitle && (
                        <div className="mb-3 md:mb-4" style={fadeUp(0.06)}>
                            <span
                                className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase px-3 py-[5px] rounded-full"
                                style={{
                                    color:      accent,
                                    background: `${accent}18`,
                                    border:     `1px solid ${accent}30`,
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {/* Título */}
                    {title && (
                        <h2
                            className="
                                font-semibold leading-[1.06] tracking-[-0.03em]
                                text-[clamp(1.65rem,4.2vw,3.4rem)]
                                mb-3 md:mb-4
                                max-w-[15ch]
                            "
                            style={fadeUp(0.13)}
                        >
                            {title}
                        </h2>
                    )}

                    {/* Línea decorativa accent */}
                    <div
                        className="mb-3 md:mb-5 h-px w-10 rounded-full"
                        style={{
                            background:  accent,
                            opacity:     loaded ? 0.75 : 0,
                            transition: "opacity 0.5s ease 0.22s",
                        }}
                    />

                    {/* Descripción */}
                    {description && (
                        <p
                            className="text-[12px] sm:text-[13px] leading-[1.75] max-w-[36ch] line-clamp-3 mb-4 md:mb-6"
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {/* Precio */}
                    {price?.current !== undefined && (
                        <div className="mb-5 md:mb-7" style={fadeUp(0.35)}>
                            <SliderPrice price={price} />
                        </div>
                    )}

                    {/* CTA */}
                    <div style={fadeUp(0.42)}>
                        <span
                            className="
                                inline-flex items-center gap-2
                                text-[13px] font-semibold tracking-wide
                                transition-all duration-300 ease-out
                                group-hover:gap-[10px]
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