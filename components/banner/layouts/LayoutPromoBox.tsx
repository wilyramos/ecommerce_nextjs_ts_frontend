"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutPromoBox({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#0d0d0d" : "#f4f4f2");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#F97316");
    const text = design.textColor ?? (isDark ? "#f0f0ef" : "#111110");
    const muted = design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A");
    const cardBg = isDark ? "#111111" : "#ffffff";
    const cardBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(15px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative flex items-center justify-center w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* Background Texture */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-10 md:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 sm:gap-8 md:gap-12 py-6 md:py-0">

                {/* ── INFO BLOCK (CARD) ── */}
                <div
                    className="
                        relative flex-shrink-0 
                        w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[420px] 
                        z-20 order-2 md:order-1
                    "
                    style={fadeUp(0.1)}
                >
                    <div
                        className="relative p-5 sm:p-7 md:p-10 overflow-hidden"
                        style={{
                            backgroundColor: cardBg,
                            border: `1px solid ${cardBorder}`,
                            boxShadow: isDark
                                ? "0 25px 50px -12px rgba(0,0,0,0.7)"
                                : "0 25px 50px -12px rgba(0,0,0,0.12)"
                        }}
                    >
                        {/* Corner Accent */}
                        <div
                            className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2"
                            style={{ borderColor: accent }}
                        />

                        <div className="flex flex-col gap-3 sm:gap-5 md:gap-6 text-center md:text-left">
                            {subtitle && (
                                <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                                    <div className="w-4 md:w-6 h-px bg-current" style={{ color: accent }} />
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]" style={{ color: accent }}>
                                        {subtitle}
                                    </span>
                                </div>
                            )}

                            {title && (
                                <h2 className="text-[clamp(1.2rem,4vw,2.4rem)] font-bold leading-[1.1] tracking-tight" style={{ color: text }}>
                                    {title}
                                </h2>
                            )}

                            {description && (
                                <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed opacity-80 line-clamp-2 md:line-clamp-none" style={{ color: muted }}>
                                    {description}
                                </p>
                            )}

                            {price?.current !== undefined && (
                                <div className="pt-2 sm:pt-4 flex flex-col gap-1 md:gap-2">
                                    <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] opacity-40" style={{ color: text }}>
                                        Oferta limitada
                                    </span>
                                    <div className="scale-90 sm:scale-100 origin-center md:origin-left">
                                        <SliderPrice
                                            price={price}
                                            color={text}
                                            accentColor={accent}
                                            isDark={isDark}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back decorative border */}
                    <div
                        className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-full h-full -z-10 border opacity-20"
                        style={{ borderColor: accent }}
                    />
                </div>

                {/* ── MEDIA SHOWCASE ── */}
                <div
                    className="
                        relative flex-1 
                        w-full h-[180px] sm:h-[240px] md:h-[75%] lg:h-[85%] 
                        flex items-center justify-center 
                        order-1 md:order-2
                    "
                    style={fadeUp(0.25)}
                >
                    {/* Ring */}
                    <div
                        className="absolute w-[140px] sm:w-[200px] md:w-[80%] aspect-square border-2 rounded-full opacity-[0.05] transition-transform duration-[3000ms] group-hover:rotate-180"
                        style={{ borderColor: accent }}
                    />

                    <div className="relative w-full h-full z-10 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
                        <ImageBorder
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            objectFit={media.objectFit ?? "contain"}
                            borderStyle={media.border ?? "none"}
                            sizes="(max-width: 768px) 80vw, 40vw"
                            priority
                            className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] md:drop-shadow-[0_35px_60px_rgba(0,0,0,0.3)]"
                        />
                    </div>

                    {/* Base shadow */}
                    <div
                        className="absolute bottom-[10%] w-[50%] h-6 md:h-12 bg-black/20 blur-2xl rounded-[100%] transition-all duration-700 group-hover:opacity-40"
                    />
                </div>
            </div>
        </Link>
    );
}