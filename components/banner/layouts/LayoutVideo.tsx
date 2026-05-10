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
    const bg = design.bgColor ?? "#000000";
    const text = design.textColor ?? "#f5f5f7";
    const muted = design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#F97316");

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

            {/* Overlays de contraste mejorados */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-10"
                style={{
                    background: isDark
                        ? "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)"
                        : "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.4) 100%)",
                    opacity: loaded ? 1 : 0,
                }}
            />

            {/* Viñeta para concentrar la atención al centro */}
            <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(circle at 50% 50%, transparent 10%, rgba(0,0,0,0.3) 100%)`,
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
                    <div style={fadeUp(0.1)} className="mb-2">
                        <span
                            className="
                                inline-block 
                                text-[10px] font-bold tracking-[0.4em] uppercase 
                                px-4 py-1.5 
                                rounded-full
                                backdrop-blur-md
                            "
                            style={{
                                color: text,
                                background: `${accent}${isDark ? "33" : "22"}`,
                                border: `1px solid ${accent}50`,
                                boxShadow: `0 0 20px ${accent}20`
                            }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {title && (
                    <h2
                        className="font-black leading-[1.05] tracking-[-0.05em] text-[clamp(2rem,5vw,3.5rem)] mt-2 mb-4 uppercase"
                        style={fadeUp(0.2, {
                            transform: loaded
                                ? "translateY(0px) scale(1)"
                                : "translateY(20px) scale(0.95)",
                            transition: "opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s"
                        })}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed max-w-[40ch] line-clamp-2 font-medium"
                        style={{
                            color: muted,
                            textShadow: isDark ? "0 2px 15px rgba(0,0,0,0.5)" : "none",
                            ...fadeUp(0.35),
                        }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div className="mt-6 md:mt-8" style={fadeUp(0.45)}>
                        <SliderPrice
                            price={price}
                            color={text}
                            accentColor={accent}
                            isDark={isDark}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}