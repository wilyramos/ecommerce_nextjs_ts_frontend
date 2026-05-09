"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
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
    const bg = design.bgColor ?? (isDark ? "#080808" : "#f5f5f7");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(14px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative flex flex-row items-center w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            <div
                className="
                    relative z-10
                    flex flex-col justify-center items-center
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
                    className="h-[2px] w-8 sm:w-14 flex-none"
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

            <div
                className="
                    relative z-10
                    flex flex-col justify-center items-center
                    w-1/2 h-full
                    p-6 sm:p-10 lg:p-12
                    pointer-events-none
                "
                style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateX(0) scale(1)" : "translateX(20px) scale(0.95)",
                }}
            >
                <div className="relative aspect-square h-full max-h-[60%] sm:max-h-[65%] min-h-0 flex items-center justify-center">
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "curved-frame"}
                        sizes="(max-width: 640px) 50vw, 50vw"
                        priority
                    />
                </div>

                {title && (
                    <div className="flex flex-col items-center gap-2 mt-4 sm:mt-6">
                        <h2
                            className="flex-none font-semibold leading-tight tracking-[-0.02em] text-[clamp(0.8rem,2vw,1.5rem)] text-center items-center max-w-full line-clamp-2"
                            style={{ color: text }}
                        >
                            {title}
                        </h2>
                        <div
                            className="h-[2px] w-8 sm:w-12 rounded-full flex-none"
                            style={{
                                background: accent,
                                opacity: loaded ? 0.6 : 0,
                                transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
                                transform: loaded ? "scaleX(1)" : "scaleX(0)",
                            }}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}