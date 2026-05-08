// File: src/components/banner/layouts/LayoutPromoBox.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutPromoBox({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark  = design.theme !== "light";
    const bg      = design.bgColor        ?? (isDark ? "#0d0d0d" : "#e8e8e6");
    const accent  = design.accentColor    ?? (isDark ? "#f97316" : "#e55a00");
    const text    = design.textColor      ?? (isDark ? "#f0f0ef" : "#111110");
    const muted   = design.textMutedColor ?? (isDark ? "#6b6b6b" : "#909090");

    // Card surface
    const cardBg     = isDark ? "#161616" : "#ffffff";
    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    const hasDiscount = price?.compare && price.compare > (price.current ?? 0);
    const discount    = hasDiscount
        ? Math.round(((price!.compare! - price!.current!) / price!.compare!) * 100)
        : null;

    const anim = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.55s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    });

    return (
        <div
            className="relative flex items-center justify-center w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* Ruido de fondo sutil */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                }}
            />

            {/* Layout: card izquierda + imagen derecha */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-10 lg:px-16 flex items-center justify-between gap-6 md:gap-10 h-full">

                {/* ── CAJA DE PROMOCIÓN ── */}
                <Link
                    href={destUrl}
                    className="group relative flex-shrink-0 flex flex-col justify-between rounded-2xl overflow-hidden cursor-pointer"
                    style={{
                        backgroundColor: cardBg,
                        border: `1px solid ${cardBorder}`,
                        width: "min(380px, 100%)",
                        minHeight: "min(420px, 80vw)",
                        ...anim(0.1),
                    }}
                >
                    {/* Franja accent top */}
                    <div className="w-full h-[3px] flex-shrink-0" style={{ backgroundColor: accent }} />

                    {/* Contenido */}
<div className="flex flex-col items-center text-center gap-4 px-7 py-7 flex-1">

                        {/* Eyebrow */}
                        {subtitle && (
                            <span
                                className="text-[9px] font-black uppercase tracking-[0.22em]"
                                style={{ color: accent }}
                            >
                                {subtitle}
                            </span>
                        )}

                        {/* Título */}
                        {title && (
                            <h2
                                className="font-semibold leading-[1.1] tracking-tight text-[clamp(1.3rem,2.8vw,1.85rem)] line-clamp-3"
                                style={{ color: text }}
                            >
                                {title}
                            </h2>
                        )}

                        {/* Descripción */}
                        {description && (
                            <p
                                className="text-[12px] leading-relaxed line-clamp-2"
                                style={{ color: muted }}
                            >
                                {description}
                            </p>
                        )}

                        {/* Precio */}
                        {price?.current !== undefined && (
<div className="flex items-center gap-3 flex-wrap mt-auto pt-2 justify-center">
                                <div className="flex items-start gap-0.5 leading-none">
                                    <span className="text-xs font-semibold mt-1.5" style={{ color: muted }}>
                                        {price.currency ?? "S/"}
                                    </span>
                                    <span
                                        className="font-bold tracking-tighter text-[clamp(2rem,4vw,3rem)] leading-none"
                                        style={{ color: text }}
                                    >
                                        {price.current.toFixed(2)}
                                    </span>
                                </div>

                                {hasDiscount && (
<div className="flex flex-col items-center gap-1 mb-0.5">
                                        <span className="text-xs line-through" style={{ color: muted }}>
                                            {price.currency ?? "S/"} {price.compare?.toFixed(2)}
                                        </span>
                                        <span
                                            className="text-[10px] font-black px-1.5 py-[3px] rounded-sm tracking-wider"
                                            style={{ backgroundColor: accent, color: "#fff" }}
                                        >
                                            −{discount}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Divisor */}
                    <div className="mx-7 h-px flex-shrink-0" style={{ backgroundColor: cardBorder }} />

                    {/* CTA footer */}
                    <div className="flex items-center justify-between px-7 py-4 flex-shrink-0">
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.18em] transition-colors duration-200 group-hover:opacity-80"
                            style={{ color: muted }}
                        >
                            Ver oferta
                        </span>
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                            style={{ backgroundColor: accent }}
                        >
                            <svg
                                width="11" height="11" viewBox="0 0 11 11"
                                fill="none" stroke="#fff" strokeWidth="2.2"
                                strokeLinecap="round" strokeLinejoin="round"
                                className="transition-transform duration-300 group-hover:translate-x-[1px]"
                            >
                                <path d="M1.5 5.5h8M5.5 1.5l4 4-4 4" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* ── IMAGEN DEL PRODUCTO ── */}
                <div
                    className="relative flex-1 h-[260px] sm:h-[360px] md:h-[480px] hidden sm:flex items-center justify-center"
                    style={anim(0.05)}
                >
                    {/* Halo */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 52%, ${accent}20 0%, transparent 62%)`,
                        }}
                    />
                    <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] drop-shadow-2xl">
                        <Image
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            className={`object-${media.objectFit ?? "contain"}`}
                            sizes="(max-width: 768px) 0vw, 45vw"
                            priority
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}