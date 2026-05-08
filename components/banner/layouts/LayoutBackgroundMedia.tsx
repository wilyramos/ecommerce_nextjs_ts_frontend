"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
    const text = design.textColor ?? "#f5f5f7";
    const muted = design.textMutedColor ?? "#86868b";
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");
    const bg = design.bgColor ?? "#000000";

    return (
        <Link
            href={destUrl}
            className="relative flex flex-col items-center justify-center w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group text-center"
            style={{ backgroundColor: bg }}
        >
            {/* Media */}
            {media.videoUrl ? (
                <video
                    ref={videoRef}
                    src={media.videoUrl}
                    poster={media.videoPoster ?? media.imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1400ms] group-hover:scale-[1.04]`}
                    priority
                />
            )}

            {/* Gradiente cinematográfico */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 70%)"
                }}
            />

            {/* Contenido */}
            <div
                className="relative z-10 flex flex-col items-center gap-2 sm:gap-3
                            px-5 sm:px-8
                            max-w-xs sm:max-w-xl md:max-w-2xl
                            w-full"
                style={{ color: text }}
            >
                {subtitle && (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest mb-1"
                        style={{
                            backgroundColor: `${accent}22`,
                            color: accent,
                            border: `1px solid ${accent}40`,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.5s ease 0.1s",
                        }}
                    >
                        {subtitle}
                    </span>
                )}

                {title && (
                    <h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[4rem]
                                    font-black leading-[1.05] tracking-tight
                                    line-clamp-3"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "none" : "translateY(16px)",
                            transition: "opacity 0.7s ease 0.18s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.18s",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[12px] sm:text-[13px] leading-relaxed
                                    max-w-[30ch] sm:max-w-[36ch] line-clamp-2 sm:line-clamp-3"
                        style={{
                            color: muted,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.6s ease 0.28s",
                        }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.35s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}