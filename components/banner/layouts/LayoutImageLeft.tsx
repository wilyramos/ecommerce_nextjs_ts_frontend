"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
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
    const bg = design.bgColor ?? (isDark ? "#0a0a0a" : "#f5f5f7");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");

    const muted = design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#F97316");

    const fadeUp = (delay: number) => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative block w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            <div className="flex flex-col md:grid md:grid-cols-[58fr_42fr] md:items-stretch h-full">

                {/* ── Columna imagen ── */}
                <div className="relative w-full h-[55%] md:h-full overflow-hidden">
                    <div className="absolute inset-0 w-full h-full z-0">
                        <ImageBorder
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            objectFit={media.objectFit ?? "cover"}
                            borderStyle={media.border ?? "none"}
                            sizes="(max-width: 768px) 100vw, 58vw"
                            className="transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                            priority
                        />
                    </div>

                    {/* Fade derecho (Desktop) */}
                    <div
                        className="absolute inset-y-0 right-0 w-32 hidden md:block pointer-events-none z-10"
                        style={{ background: `linear-gradient(to right, transparent, ${bg})` }}
                    />

                    {/* Velo inferior (Mobile) */}
                    <div
                        className="absolute inset-x-0 bottom-0 h-2/5 md:hidden pointer-events-none z-10"
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
                        xl:px-20
                    "
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-4 md:mb-6" style={fadeUp(0.06)}>
                            <span
                                className="
                                    inline-block 
                                    text-xs font-black uppercase 
                                    px-3 py-1.5 
                                "
                                style={{
                                    color: isDark ? "#000" : "#fff",
                                    background: accent,
                                    boxShadow: `4px 4px 0px ${accent}44`
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="
                                font-bold leading-[1.1] tracking-[-0.03em]
                                text-[clamp(1.8rem,4.5vw,3.5rem)]
                                mb-4 md:mb-5
                                max-w-[15ch]
                            "
                            style={fadeUp(0.13)}
                        >
                            {title}
                        </h2>
                    )}

                    {/* Línea decorativa minimalista */}
                    <div
                        className="mb-5 md:mb-7 h-[2px] w-12"
                        style={{
                            background: accent,
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "scaleX(1)" : "scaleX(0)",
                            transformOrigin: "left",
                            transition: "opacity 0.5s ease 0.22s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s",
                        }}
                    />

                    {description && (
                        <p
                            className="text-[13px] sm:text-[14px] leading-[1.8] max-w-[38ch] line-clamp-3 mb-6 md:mb-8 font-medium"
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div className="mb-2" style={fadeUp(0.4)}>
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