"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutSplitDiagonal({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#888888" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative flex items-stretch w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Imagen con diagonal ── */}
            <div
                className="absolute inset-0"
                style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 44% 100%)" }}
            >
                {/* Desktop */}
                <div
                    className="absolute inset-0 hidden sm:block"
                    style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 28% 100%)" }}
                >
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        sizes="(max-width: 640px) 50vw, 60vw"
                        className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                        priority
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `linear-gradient(to right, ${bg} 0%, transparent 22%)` }}
                    />
                </div>

                {/* Mobile */}
                <div className="absolute inset-0 sm:hidden">
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        sizes="60vw"
                        className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]`}
                        priority
                    />
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: `linear-gradient(to right, ${bg} 0%, transparent 28%)` }}
                    />
                </div>
            </div>

            {/* ── Línea diagonal SVG ── */}
            <svg
                className="absolute inset-0 z-20 w-full h-full pointer-events-none hidden sm:block"
                preserveAspectRatio="none" viewBox="0 0 100 100"
            >
                <line
                    x1="45" y1="0" x2="28" y2="100"
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
                    strokeWidth="0.25" vectorEffect="non-scaling-stroke"
                />
            </svg>
            <svg
                className="absolute inset-0 z-20 w-full h-full pointer-events-none sm:hidden"
                preserveAspectRatio="none" viewBox="0 0 100 100"
            >
                <line
                    x1="60" y1="0" x2="44" y2="100"
                    stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}
                    strokeWidth="0.25" vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* ── Contenido ── */}
            <div
                className="
                    relative z-10
                    flex flex-col justify-center
                    w-[55%] sm:w-[44%]
                    pl-6 pr-4
                    sm:pl-10 sm:pr-6
                    md:pl-14 md:pr-8
                    lg:pl-20
                    gap-2.5 sm:gap-3
                "
                style={{ color: text }}
            >
                {subtitle && (
                    <div style={fadeUp(0.08)}>
                        <span
                            className="inline-block text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase px-2.5 py-[4px] rounded-full"
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
                        className="font-semibold leading-[1.06] tracking-[-0.03em] text-[clamp(1.5rem,3.8vw,3.2rem)] max-w-[12ch]"
                        style={fadeUp(0.15)}
                    >
                        {title}
                    </h2>
                )}

                <div
                    className="h-px w-9 rounded-full"
                    style={{
                        background:  accent,
                        opacity:     loaded ? 0.7 : 0,
                        transition: "opacity 0.5s ease 0.24s",
                    }}
                />

                {description && (
                    <p
                        className="text-[11px] sm:text-[12px] leading-[1.75] max-w-[28ch] line-clamp-3"
                        style={{ color: muted, ...fadeUp(0.28) }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={fadeUp(0.35)}>
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}