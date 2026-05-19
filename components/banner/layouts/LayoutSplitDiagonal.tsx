"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutSplitDiagonal({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Alineación estricta con los tokens CSS mapeados a variables semánticas
    const isDark = design.theme !== "light";
    const bg = isDark ? "var(--color-primary)" : "var(--color-background)";
    const text = isDark ? "var(--color-primary-foreground)" : "var(--color-foreground)";
    const accent = "var(--color-action-cta)";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative flex items-stretch w-full overflow-hidden border border-border"
            style={{ backgroundColor: bg }}
        >
            {/* ── Imagen con diagonal ── */}
            <div
                className="absolute inset-0 z-0"
                style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 44% 100%)" }}
            >
                {/* Desktop */}
                <div
                    className="absolute inset-0 hidden sm:block"
                    style={{ clipPath: "polygon(45% 0, 100% 0, 100% 100%, 28% 100%)" }}
                >
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "none"}
                        sizes="(max-width: 640px) 50vw, 60vw"
                        className="transition-transform duration-[1800ms] ease-in-out group-hover:scale-110 group-hover:rotate-1"
                        priority
                    />
                    <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{ background: `linear-gradient(to right, ${bg} 0%, transparent 25%)` }}
                    />
                </div>

                {/* Mobile */}
                <div className="absolute inset-0 sm:hidden">
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "none"}
                        sizes="60vw"
                        className="transition-transform duration-[1400ms] ease-in-out group-hover:scale-105"
                        priority
                    />
                    <div
                        className="absolute inset-0 pointer-events-none z-20"
                        style={{ background: `linear-gradient(to right, ${bg} 0%, transparent 35%)` }}
                    />
                </div>
            </div>

            {/* ── Línea diagonal SVG (Animada) ── */}
            <svg
                className="absolute inset-0 z-20 w-full h-full pointer-events-none"
                preserveAspectRatio="none" viewBox="0 0 100 100"
            >
                <line
                    className="transition-all duration-1000 ease-out"
                    x1={loaded ? "45" : "100"} y1="0" 
                    x2={loaded ? "28" : "100"} y2="100"
                    stroke={accent}
                    strokeWidth="0.5"
                    strokeOpacity={isDark ? "0.4" : "0.3"}
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            {/* ── Contenido: Limitado a max-w-6xl y centrado horizontalmente ── */}
            <div className="relative z-30 w-full max-w-6xl mx-auto h-full flex items-center">
                <div
                    className="
                        flex flex-col justify-center
                        w-[58%] sm:w-[45%]
                        pl-6 pr-4
                        sm:pl-10 sm:pr-6
                        md:pl-14 md:pr-8
                        gap-3 sm:gap-4
                    "
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div style={fadeUp(0.08)}>
                            <span
                                className="
                                    inline-block 
                                    text-[10px] sm:text-[11px] 
                                    font-bold tracking-wider uppercase 
                                    px-3 py-1 
                                    border-r-2
                                "
                                style={{
                                    color: accent,
                                    borderColor: accent
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-bold leading-[1] tracking-[-0.04em] text-[clamp(1.6rem,4.5vw,3.5rem)] max-w-[14ch] uppercase"
                            style={fadeUp(0.15)}
                        >
                            {title}
                        </h2>
                    )}

                    <div
                        className="h-[2px] w-12 rounded-full"
                        style={{
                            background: accent,
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "scaleX(1)" : "scaleX(0)",
                            transformOrigin: "left",
                            transition: "opacity 0.5s ease 0.3s, transform 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s",
                        }}
                    />

                    {description && (
                        <p
                            className="text-[12px] sm:text-[13px] leading-[1.6] max-w-[30ch] line-clamp-3 font-medium text-muted-foreground"
                            style={fadeUp(0.28)}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div style={fadeUp(0.4)} className="mt-1">
                            <SliderPrice 
                                price={price} 
                                color={text} 
                                accentColor={accent} 
                                isDark={isDark} 
                            />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}