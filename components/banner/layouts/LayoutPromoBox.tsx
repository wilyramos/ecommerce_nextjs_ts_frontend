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

    const isDark     = design.theme !== "light";
    const bg         = design.bgColor        ?? (isDark ? "#0d0d0d" : "#e8e8e6");
    const accent     = design.accentColor    ?? (isDark ? "#f97316" : "#e55a00");
    const text       = design.textColor      ?? (isDark ? "#f0f0ef" : "#111110");
    const muted      = design.textMutedColor ?? (isDark ? "#6b6b6b" : "#909090");
    const cardBg     = isDark ? "#161616" : "#ffffff";
    const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    const hasDiscount = price?.compare && price.compare > (price.current ?? 0);
    const discount    = hasDiscount
        ? Math.round(((price!.compare! - price!.current!) / price!.compare!) * 100)
        : null;

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            className="group relative flex items-center justify-center w-full overflow-hidden h-[360px] sm:h-[460px] md:h-[600px]"
            style={{ backgroundColor: bg }}
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                }}
            />

            <div className="relative z-10 w-full h-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between gap-6 md:gap-10">
                <div
                    className="sm:hidden absolute inset-0 pointer-events-none"
                    style={fadeUp(0.04)}
                >
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        sizes="100vw"
                        className={`object-${media.objectFit ?? "contain"} opacity-10`}
                        priority
                    />
                    {/* Halo accent detrás */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 70% 50%, ${accent}15 0%, transparent 65%)`,
                        }}
                    />
                </div>

                <div
                    className="
                        relative flex-shrink-0 flex flex-col justify-between
                         overflow-hidden
                        /* mobile: ocupa casi todo el ancho centrado */
                        w-full max-w-[320px] mx-auto
                        /* desktop: ancho fijo, sin centrado */
                        sm:mx-0 sm:w-[300px] md:w-[340px] lg:w-[380px]
                        /* altura proporcional al banner */
                        h-[78%] sm:h-[82%] md:h-[80%]
                    "
                    style={{
                        backgroundColor: cardBg,
                        border: `1px solid ${cardBorder}`,
                        boxShadow: isDark
                            ? "0 24px 64px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset"
                            : "0 24px 64px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
                        ...fadeUp(0.1),
                    }}
                >
                    {/* Franja accent superior */}
                    <div
                        className="w-full flex-shrink-0"
                        style={{
                            height: "3px",
                            background: `linear-gradient(to right, ${accent}, ${accent}88)`,
                        }}
                    />

                    {/* Contenido principal */}
                    <div className="flex flex-col items-center text-center gap-3 px-6 sm:px-7 py-6 sm:py-7 flex-1 min-h-0">

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
                                className="font-semibold leading-[1.1] tracking-tight text-[clamp(1.15rem,2.6vw,1.75rem)] line-clamp-3"
                                style={{ color: text }}
                            >
                                {title}
                            </h2>
                        )}

                        {/* Descripción */}
                        {description && (
                            <p
                                className="text-[11px] sm:text-[12px] leading-relaxed line-clamp-2"
                                style={{ color: muted }}
                            >
                                {description}
                            </p>
                        )}

                        {/* Precio */}
                        {price?.current !== undefined && (
                            <div className="flex items-center gap-3 flex-wrap mt-auto pt-2 justify-center">
                                <div className="flex items-start gap-0.5 leading-none">
                                    <span
                                        className="text-xs font-semibold mt-[7px]"
                                        style={{ color: muted }}
                                    >
                                        {price.currency ?? "S/"}
                                    </span>
                                    <span
                                        className="font-bold tracking-tighter text-[clamp(1.9rem,3.8vw,2.8rem)] leading-none"
                                        style={{ color: text }}
                                    >
                                        {price.current.toFixed(2)}
                                    </span>
                                </div>

                                {hasDiscount && (
                                    <div className="flex flex-col items-center gap-1">
                                        <span
                                            className="text-[11px] line-through"
                                            style={{ color: muted }}
                                        >
                                            {price.currency ?? "S/"} {price.compare?.toFixed(2)}
                                        </span>
                                        <span
                                            className="text-[10px] font-black px-1.5 py-[3px] tracking-wider"
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
                    <div className="mx-6 sm:mx-7 h-px flex-shrink-0" style={{ backgroundColor: cardBorder }} />

                   
                </div>

                {/* ── IMAGEN DEL PRODUCTO — solo desktop ──────────────── */}
                <div
                    className="hidden sm:flex relative flex-1 h-full items-center justify-center"
                    style={fadeUp(0.05)}
                >
                    {/* Halo accent detrás de la imagen */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(circle at 50% 52%, ${accent}22 0%, transparent 60%)`,
                        }}
                    />

                    <div
                        className="relative w-full h-[75%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        style={{ filter: "drop-shadow(0 32px 48px rgba(0,0,0,0.35))" }}
                    >
                        <Image
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            className={`object-${media.objectFit ?? "contain"}`}
                            sizes="45vw"
                            priority
                        />
                    </div>
                </div>

            </div>
        </Link>
    );
}