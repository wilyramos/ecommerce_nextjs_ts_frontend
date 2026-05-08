"use client";

import Link        from "next/link";
import Image       from "next/image";
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

    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#000000" : "#ffffff");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    return (
        <Link
            href={destUrl}

            className="relative flex flex-col items-center justify-center w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group text-center"
            style={{ backgroundColor: bg }}
        >
            {/* Imagen — fondo desaturado muy velado */}
            <Image
                src={media.imageUrl}
                alt={media.altText}
                fill
                className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]`}
                style={{ opacity: isDark ? 0.18 : 0.1, filter: "saturate(0.3)" }}
                priority
            />

            {/* Gradiente radial — foco central */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isDark
                        ? "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)"
                        : "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%)",
                }}
            />

            {/* Contenido central */}
            <div
                className="relative z-10 flex flex-col items-center gap-3 px-5 sm:px-8 max-w-xs sm:max-w-lg md:max-w-2xl w-full"
                style={{ color: text }}
            >
                {subtitle && (
                    <p
                        className="text-[10px] font-semibold tracking-widest uppercase"
                        style={{
                            color: accent,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.5s ease 0.1s",
                        }}
                    >
                        {subtitle}
                    </p>
                )}

                {title && (
                    <h2
                        /**
                         * Mobile: text-3xl (≈ 30 px)
                         * sm:     text-4xl (≈ 36 px)
                         * md+:    clamp hasta ~72 px
                         */
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[4.5rem] font-semibold leading-[1.05] tracking-tight"
                        style={{
                            opacity:   loaded ? 1 : 0,
                            transform: loaded ? "scale(1)" : "scale(0.96)",
                            transition: "opacity 0.7s ease 0.18s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[12px] sm:text-[13px] leading-relaxed max-w-[30ch] sm:max-w-[36ch] line-clamp-3"
                        style={{
                            color: muted,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.6s ease 0.3s",
                        }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.38s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}