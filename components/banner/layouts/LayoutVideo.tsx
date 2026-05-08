"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect, useMemo } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutVideo({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loaded, setLoaded] = useState(false);

    const isDark = design.theme !== "light";

    const colors = useMemo(() => ({
        text: design.textColor ?? (isDark ? "#ffffff" : "#0f172a"),
        textMuted: design.textMutedColor ?? (isDark ? "rgba(255,255,255,0.6)" : "rgba(15,23,42,0.6)"),
        accent: design.accentColor ?? (isDark ? "#fbbf24" : "#f59e0b"),
        bg: design.bgColor ?? (isDark ? "#050505" : "#f8f8f8"),
        overlay: isDark
            ? "from-black/80 via-black/20 to-transparent"
            : "from-white/90 via-white/30 to-transparent",
    }), [design, isDark]);

    useEffect(() => { setLoaded(true); }, []);

    return (
        <div

            className="relative w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{
                backgroundColor: colors.bg,
                color: colors.text,
                "--color-accent-warm": colors.accent,
                "--color-accent-warm-light": `${colors.accent}33`,
            } as React.CSSProperties}
        >
            {/* ── Media ───────────────────────────────────────────────── */}
            <div className="absolute inset-0">
                {media.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={media.videoUrl}
                        poster={media.videoPoster ?? media.imageUrl}
                        autoPlay muted loop playsInline
                        className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out"
                        style={{ transform: loaded ? "scale(1)" : "scale(1.1)" }}
                    />
                ) : (
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        className={`object-${media.objectFit ?? "cover"} transition-transform duration-[10000ms]`}
                        style={{ transform: loaded ? "scale(1)" : "scale(1.1)" }}
                        priority
                    />
                )}
            </div>

            {/* ── Overlays ────────────────────────────────────────────── */}
            <div className={`absolute inset-0 bg-gradient-to-t ${colors.overlay} opacity-80 md:opacity-100`} />
            <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? "from-black/40" : "from-white/40"} via-transparent to-transparent`} />

            {/* ── Contenido ───────────────────────────────────────────── */}
            <Link
                href={destUrl}
                /**
                 * Mobile  : padding lateral pequeño, pb-8
                 * sm+     : padding lateral mayor, pb-12/16
                 */
                className="absolute inset-0 z-10 flex flex-col items-center justify-center
            px-5 sm:px-8 md:px-16"
            >
                {/*
                 * Mobile  : stack vertical (flex-col)
                 * md+     : texto a la izquierda + precio a la derecha (flex-row)
                 */}
                <div className="flex flex-col items-center gap-5">

                    {/* Bloque de texto */}
                    <div
                        className="flex flex-col items-center text-center gap-2 sm:gap-3 max-w-xl" style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "translateY(0)" : "translateY(20px)",
                            transition: "all 0.8s cubic-bezier(0.2,0.8,0.2,1) 0.2s",
                        }}
                    >
                        {subtitle && (
                            <span
                                className="text-[10px] font-black uppercase tracking-[0.4em]
            px-2.5 py-1 border border-current rounded-full"

                                style={{ color: colors.accent }}
                            >
                                {subtitle}
                            </span>
                        )}

                        {title && (
                            <h2
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                                            font-bold leading-[0.95] tracking-tighter line-clamp-3"
                                style={{ color: colors.text }}
                            >
                                {title}
                            </h2>
                        )}

                        {description && (
                            <p
                                className="text-[12px] sm:text-sm leading-relaxed
                                            max-w-xs sm:max-w-md opacity-90 line-clamp-2 sm:line-clamp-3"
                                style={{ color: colors.textMuted }}
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Precio */}
                    {price?.current !== undefined && (
                        <div
                            className="shrink-0 transition-all duration-700 delay-500"
                            style={{
                                opacity: loaded ? 1 : 0,
                                transform: loaded ? "scale(1)" : "scale(0.9) translateY(10px)",
                            }}
                        >
                            <SliderPrice price={price} />
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
}