"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutBackgroundMedia({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    // Alineación estricta con los tokens CSS mapeados a variables semánticas
    const isDark = design.theme !== "light";
    const bg = isDark ? "var(--color-primary)" : "var(--color-background)";
    const text = isDark ? "var(--color-primary-foreground)" : "var(--color-foreground)";
    const muted = "var(--color-muted-foreground)";
    const accent = "var(--color-action-cta)";

    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    const isVideo = Boolean(media.videoUrl);

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            /* Contenedor raíz: Ocupa todo el ancho disponible */
            className="banner-slot group relative w-full overflow-hidden flex items-end justify-center text-center border border-border h-[var(--banner-h-mobile)] md:h-[var(--banner-h)]"
            style={{ backgroundColor: bg }}
        >
            {/* ── Media de fondo: imagen o video a ancho completo ── */}
            {isVideo ? (
                <video
                    ref={videoRef}
                    src={media.videoUrl}
                    poster={media.videoPoster ?? media.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
            ) : (
                <div className="absolute inset-0 w-full h-full z-0">
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "none"}
                        sizes="100vw"
                        className="transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        priority
                    />
                </div>
            )}

            {/* Rampa inferior decorativa (Fondo) */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
                style={{
                    height: "70%",
                    background: `linear-gradient(to top,
                        rgba(0,0,0,0.88) 0%,
                        rgba(0,0,0,0.65) 30%,
                        rgba(0,0,0,0.25) 60%,
                        transparent 100%)`,
                }}
            />

            {/* ── Contenido: Limitado a max-w-6xl y centrado ── */}
            <div className="relative z-20 w-full max-w-6xl mx-auto px-6 pb-9 sm:pb-12 md:pb-16 flex flex-col items-center">
                
                <div
                    className="flex flex-col items-center w-full max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-3 md:mb-4" style={fadeUp(0.08)}>
                            <span
                                className="inline-block text-[10px] font-bold tracking-[0.32em] uppercase px-3 py-[5px] rounded-full"
                                style={{
                                    color: accent,
                                    background: `${accent}22`,
                                    border: `1px solid ${accent}40`,
                                    backdropFilter: "blur(6px)",
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-black leading-[1.03] tracking-[-0.04em] text-[clamp(1.8rem,6vw,4.5rem)] mb-0"
                            style={fadeUp(0.15, {
                                transform: loaded
                                    ? "translateY(0px) scale(1)"
                                    : "translateY(18px) scale(0.96)",
                                transition: `opacity 0.8s ease 0.15s,
                                             transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s`,
                            })}
                        >
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p
                            className="mt-3 md:mt-4 text-[12px] sm:text-[13px] md:text-[14px] leading-[1.7] max-w-[34ch] line-clamp-2"
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div className="mt-3 md:mt-4" style={fadeUp(0.35)}>
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