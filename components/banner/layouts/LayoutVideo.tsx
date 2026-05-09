"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutVideo({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? "#000000";
    const text   = design.textColor      ?? "#f5f5f7";
    const muted  = design.textMutedColor ?? (isDark ? "#aaaaaa" : "#d0d0d5");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    const isVideo = Boolean(media.videoUrl);

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative w-full overflow-hidden flex items-center justify-center text-center"
            style={{ backgroundColor: bg }}
        >
            {/* ── Media a sangre completa ── */}
            <div className="absolute inset-0 z-0">
                {isVideo ? (
                    <video
                        ref={videoRef}
                        src={media.videoUrl}
                        poster={media.videoPoster ?? media.imageUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                ) : (
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
                )}
            </div>

            {/* Overlay general */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-10"
                style={{
                    background: isDark
                        ? "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)"
                        : "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.5) 100%)",
                    opacity: loaded ? 1 : 0,
                }}
            />

            {/* Viñeta perimetral */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,0.4) 100%)`,
                }}
            />

            {/* ── Contenido centrado ── */}
            <div
                className="
                    relative z-20
                    flex flex-col items-center
                    w-full max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-4xl
                    px-6
                "
                style={{ color: text }}
            >
                {subtitle && (
                    <div style={fadeUp(0.1)}>
                        <span
                            className="inline-block text-[10px] font-bold tracking-[0.35em] uppercase px-3 py-[5px] rounded-full"
                            style={{
                                color:          accent,
                                background:     `${accent}22`,
                                border:         `1px solid ${accent}40`,
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {title && (
                    <h2
                        className="font-black leading-[1.03] tracking-[-0.04em] text-[clamp(2.2rem,7vw,5rem)] mt-4 mb-2"
                        style={fadeUp(0.2, {
                            transform: loaded
                                ? "translateY(0px) scale(1)"
                                : "translateY(18px) scale(0.96)",
                        })}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[13px] sm:text-[15px] md:text-[17px] leading-relaxed max-w-[38ch] line-clamp-2"
                        style={{
                            color:      muted,
                            textShadow: isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
                            ...fadeUp(0.3),
                        }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div className="mt-4" style={fadeUp(0.4)}>
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}