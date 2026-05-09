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

    const fadeUp = (delay: number) => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            // banner-slot provee la altura desde el carrusel.
            // El grid interno usa h-full para que la imagen llene esa altura.
            className="banner-slot group relative block w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* Grid ocupa todo el alto del banner-slot */}
            <div className="flex flex-col md:grid md:grid-cols-[58fr_42fr] md:items-stretch h-full">

                {/* ── Columna imagen ── */}
                {/* Mobile: altura fija proporcional. Desktop: h-full hereda del grid */}
                <div className="relative w-full h-[55%] md:h-full overflow-hidden">
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

                    {/* Fade derecho — funde con panel de texto (solo desktop) */}
                    <div
                        className="absolute inset-y-0 right-0 w-28 hidden md:block pointer-events-none"
                        style={{ background: `linear-gradient(to right, transparent, ${bg})` }}
                    />

                    {/* Velo inferior — solo mobile */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-2/5 md:hidden pointer-events-none"
                        style={{ background: `linear-gradient(to top, ${bg}, transparent)` }}
                    />
                </div>

                {/* ── Columna texto ── */}
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

                    <div
                        className="mb-3 md:mb-5 h-px w-10 rounded-full"
                        style={{
                            background:  accent,
                            opacity:     loaded ? 0.75 : 0,
                            transition: "opacity 0.5s ease 0.22s",
                        }}
                    />

                    {description && (
                        <p
                            className="text-[12px] sm:text-[13px] leading-[1.75] max-w-[36ch] line-clamp-3 mb-4 md:mb-6"
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div className="mb-5 md:mb-7" style={fadeUp(0.35)}>
                            <SliderPrice price={price} />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}