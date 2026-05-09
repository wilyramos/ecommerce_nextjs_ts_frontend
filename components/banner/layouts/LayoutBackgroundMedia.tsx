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

    const isDark = design.theme !== "light";
    const bg     = design.bgColor         ?? "#000000";
    const text   = design.textColor       ?? "#f5f5f7";
    const muted  = design.textMutedColor  ?? (isDark ? "#aaaaaa" : "#d0d0d5");
    const accent = design.accentColor     ?? (isDark ? "#2997ff" : "#0071e3");

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
            className="banner-slot group relative w-full overflow-hidden flex items-end justify-center text-center"
            style={{ backgroundColor: bg }}
        >
            {/* ── Media: imagen o video a sangre completa ── */}
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

          

            {/* Rampa inferior — zona de texto */}
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

            {/* ── Contenido anclado al fondo ── */}
            <div
                className="
                    relative z-20
                    flex flex-col items-center
                    w-full
                    max-w-[22rem] sm:max-w-xl md:max-w-2xl lg:max-w-3xl
                    px-6 sm:px-10
                    pb-9 sm:pb-12 md:pb-16
                "
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
                        className="font-black leading-[1.03] tracking-[-0.04em] text-[clamp(2.2rem,7vw,5.5rem)] mb-0"
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
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}