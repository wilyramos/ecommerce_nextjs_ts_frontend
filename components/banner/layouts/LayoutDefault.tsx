"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutDefault({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            // banner-slot provee la altura desde el carrusel
            className="banner-slot group relative flex flex-row items-center w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Gradiente radial de fondo ── */}
            <div
                className="absolute right-0 top-0 w-[70%] h-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 70% 50%, ${accent}12 0%, transparent 70%)`,
                }}
            />

            {/* ── Columna 1: Contenido (Izquierda) - Ocupa 1/2 espacio ── */}
            <div
                className="
                    relative z-10
                    flex flex-col justify-center
                    w-1/2 h-full
                    pl-4 sm:pl-8 md:pl-16 lg:pl-24
                    pr-2 sm:pr-4
                    gap-2 sm:gap-3 md:gap-4
                    overflow-hidden
                "
                style={{ color: text }}
            >
                {subtitle && (
                    <div style={fadeUp(0.1)} className="flex-none">
                        <span
                            className="inline-block text-[9px] sm:text-[11px] font-bold tracking-[0.2em] uppercase line-clamp-1"
                            style={{ color: accent }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                <div
                    className="h-[2px] w-8 sm:w-14 rounded-full flex-none"
                    style={{
                        background: accent,
                        opacity: loaded ? 0.8 : 0,
                        transition: "opacity 0.5s ease 0.2s",
                    }}
                />

                {description && (
                    <p
                        className="text-[11px] sm:text-[13px] md:text-[15px] leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-4 min-h-0"
                        style={{ color: muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={fadeUp(0.4)} className="flex-none origin-left scale-[0.85] sm:scale-100">
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>

            {/* ── Columna 2: Imagen y Título (Derecha) - Ocupa 1/2 espacio y centrado ── */}
            <div
                className="
                    relative z-10
                    flex flex-col justify-center items-center // <--- Centrado vertical y horizontal
                    w-1/2 h-full
                    p-3 sm:p-6 lg:p-8 // <--- Padding reducido en móvil para dar espacio a la img
                    pointer-events-none
                    overflow-hidden
                "
                style={{
                    opacity:    loaded ? 1 : 0,
                    transform:  loaded ? "translateX(0) scale(1)" : "translateX(20px) scale(0.95)",
                    transition: "opacity 1s ease 0.1s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
            >
              
                <div className="relative w-full h-full max-h-[70%] sm:max-h-[75%] min-h-0">
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        className={`
                            object-${media.objectFit ?? "contain"}
                            object-center // <--- Centrado dentro de su espacio
                            drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                            transition-transform duration-[2000ms] ease-out
                            group-hover:scale-[1.03]
                        `}
                        sizes="(max-width: 640px) 50vw, 50vw"
                        priority
                    />
                </div>
                {title && (
                    <h2
                        // flex-none: no se estira ni encoge.
                        // mt-1 sm:mt-2: Margen superior pequeño para estar "muy pegado".
                        className="flex-none font-semibold leading-tight tracking-[-0.02em] text-[clamp(0,8rem,2vw,1,5rem)] text-center max-w-full line-clamp-2 mt-1 sm:mt-2"
                        style={{ color: text }}
                    >
                        {title}
                    </h2>
                )}
            </div>
        </Link>
    );
}