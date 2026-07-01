"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutBackgroundMedia({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, terms, price, destUrl, openInNewTab } = banner;
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#a8a8a8" : "#0f0f0f");
    const accent = design.accentColor ?? "#ff6000";

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isVideo = Boolean(media?.videoUrl);

    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    const content = (
        <div
            className="banner-slot group relative w-full overflow-hidden flex flex-col justify-end select-none"
            style={{ backgroundColor: bg }}
        >
            {/* Capa de Media (Video o Imagen de Fondo) */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {isVideo && media?.videoUrl ? (
                    <video
                        ref={videoRef}
                        src={media.videoUrl}
                        poster={media.imageUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <>
                        {media?.imageUrl && (
                            <Image
                                src={media.imageUrl}
                                alt={title || "Background Media Content"}
                                fill
                                className={`${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                                    media.objectFit === "contain" ? "object-contain" : "object-cover"
                                }`}
                                sizes="100vw"
                                priority
                                unoptimized
                            />
                        )}

                        {media?.mobileImageUrl && (
                            <Image
                                src={media.mobileImageUrl}
                                alt={title || "Background Media Content Mobile"}
                                fill
                                className="md:hidden object-cover"
                                sizes="100vw"
                                priority
                                unoptimized
                            />
                        )}
                    </>
                )}
                {/* Overlay de contraste para legibilidad en móviles */}
                <div 
                    className={`absolute inset-0 h-full w-full bg-gradient-to-t ${
                        isDark ? "from-black/80 via-black/40 to-transparent" : "from-white/90 via-white/50 to-transparent"
                    } md:from-black/20 md:to-black/20`} 
                />
            </div>

            {/* Contenedor de Textos sobre la Media */}
            <div className="w-full h-full flex flex-col justify-end md:justify-center p-6 sm:p-8 md:p-12 z-10 relative box-border">
                <div className="flex flex-col gap-1 md:gap-2 max-w-full">
                    {subtitle && (
                        <span
                            className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase"
                            style={{ color: accent, ...fadeUp(0.1) }}
                        >
                            {subtitle}
                        </span>
                    )}

                    {title && (
                        <h2
                            className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight uppercase leading-none text-balance"
                            style={{ color: isDark ? "#ffffff" : "#0f0f0f", ...fadeUp(0.18) }}
                        >
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p
                            className="text-xs sm:text-sm leading-relaxed max-w-[40ch] line-clamp-2 md:line-clamp-3 mt-1"
                            style={{ color: text, opacity: 0.85, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && price.current !== null && (
                        <div className="mt-2 md:mt-4" style={fadeUp(0.35)}>
                            <SliderPrice
                                price={price}
                                textColor={text}
                                accentColor={accent}
                                isDark={isDark}
                            />
                        </div>
                    )}

                    {terms && (
                        <div style={fadeUp(0.40)} className="mt-2 md:mt-5">
                            <p className="text-[8px] sm:text-[9px] font-medium tracking-wide uppercase opacity-50" style={{ color: text }}>
                                {terms}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (!destUrl) return content;

    return (
        <Link
            href={destUrl}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            aria-label={title || "Slider Banner Link"}
        >
            {content}
        </Link>
    );
}