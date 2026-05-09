"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutMinimal({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    /* ─── Tokens de diseño estandarizados ────────────────────────── */
    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#050505" : "#ffffff");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(15px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            className="group relative flex flex-col sm:flex-row items-center w-full overflow-hidden h-[420px] sm:h-[460px] md:h-[600px]"
            style={{ backgroundColor: bg }}
        >
            {/* ════════════════════════════════════════════════════════
                FONDO: Resplandor (Glow) sutil detrás del producto
            ════════════════════════════════════════════════════════ */}
            <div 
                className="absolute right-0 sm:right-[10%] top-1/2 -translate-y-1/2 w-[80%] sm:w-[45%] aspect-square rounded-full pointer-events-none blur-[120px]"
                style={{
                    background: `${accent}${isDark ? "12" : "08"}`,
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 1.5s ease 0.3s",
                }} 
            />

            {/* ════════════════════════════════════════════════════════
                CONTENIDO: Posicionamiento reordenado
            ════════════════════════════════════════════════════════ */}
            <div 
                className="
                    relative z-20 
                    flex flex-col 
                    items-center text-center
                    sm:items-start sm:text-left
                    w-full sm:w-[50%] 
                    px-8 sm:pl-12 md:pl-20 lg:pl-32
                    mt-12 sm:mt-0
                    order-2 sm:order-1
                "
                style={{ color: text }}
            >
                {subtitle && (
                    <div style={fadeUp(0.1)}>
                        <span 
                            className="text-[10px] font-black uppercase tracking-[0.35em]"
                            style={{ color: accent }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {title && (
                    <h2 
                        className="mt-2 sm:mt-4 font-bold leading-[1.1] tracking-tight text-[clamp(1.8rem,5vw,3.2rem)] max-w-[15ch]"
                        style={fadeUp(0.2)}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p 
                        className="mt-3 sm:mt-5 text-[13px] sm:text-[15px] leading-relaxed max-w-[34ch] line-clamp-2"
                        style={{ color: muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                <div 
                    className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-6"
                    style={fadeUp(0.4)}
                >
                    {price?.current !== undefined && (
                        <SliderPrice price={price} />
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                IMAGEN: El héroe visual
            ════════════════════════════════════════════════════════ */}
            <div 
                className="
                    relative sm:absolute 
                    right-0 sm:right-8 md:right-16 lg:right-24
                    w-[70%] sm:w-[45%]
                    h-[200px] sm:h-[80%]
                    order-1 sm:order-2
                    flex items-center justify-center
                "
                style={{
                    opacity:    loaded ? 1 : 0,
                    transform:  loaded ? "scale(1) translateX(0)" : "scale(0.9) translateX(20px)",
                    transition: "opacity 1s ease 0.15s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 0.15s",
                }}
            >
                <Image 
                    src={media.imageUrl} 
                    alt={media.altText} 
                    fill
                    className={`
                        object-${media.objectFit ?? "contain"} 
                        drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]
                        transition-transform duration-[2000ms] ease-out
                        group-hover:scale-[1.04]
                    `}
                    sizes="(max-width: 640px) 80vw, 45vw"
                    priority 
                />
            </div>
        </Link>
    );
}