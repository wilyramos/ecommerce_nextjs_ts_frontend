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
    const muted = design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#F97316");

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
            {/* --- LADO IZQUIERDO: TEXTO --- */}
            <div
                className="
                    relative z-10
                    flex flex-col justify-center items-start
                    w-1/2 h-full
                    pl-6 sm:pl-12 md:pl-20 lg:pl-28
                    pr-4
                    gap-3 sm:gap-4
                    overflow-hidden
                "
                style={{ color: text }}
            >
                {subtitle && (
                    <div style={fadeUp(0.1)} className="flex-none">
                        <span
                            className="
                                inline-block 
                                text-[10px] sm:text-[11px] 
                                font-bold uppercase 
                                px-2.5 py-1 
                            "
                            style={{
                                color: isDark ? "#fff" : text,
                                borderLeft: `3px solid ${accent}`
                            }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {/* Divider decorativo animado */}
                <div
                    className="h-[1px] w-12 sm:w-20 flex-none"
                    style={{
                        background: `linear-gradient(90deg, ${accent}, transparent)`,
                        opacity: loaded ? 0.8 : 0,
                        transition: "opacity 0.5s ease 0.2s",
                    }}
                />

                {description && (
                    <div style={fadeUp(0.3)} className="relative">
                        <p
                            className="
                                text-[11px] sm:text-[13px] md:text-[15px] 
                                leading-relaxed 
                                line-clamp-3 sm:line-clamp-4 
                                max-w-[32ch]
                                italic
                            "
                            style={{ color: muted }}
                        >
                            {description}
                        </p>
                    </div>
                )}

                {price?.current !== undefined && (
                    <div style={fadeUp(0.45)} className="flex-none origin-left scale-[0.85] sm:scale-100 mt-2">
                        <SliderPrice
                            price={price}
                            color={text}
                            accentColor={accent}
                            isDark={isDark}
                        />
                    </div>
                )}
            </div>

            {/* --- LADO DERECHO: MEDIA Y TITULO --- */}
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
                    transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)"
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
                        className="transition-transform duration-[2000ms] group-hover:rotate-2 group-hover:scale-110"
                        priority
                    />
                </div>

                {title && (
                    <div className="flex flex-col items-center gap-2 mt-4 sm:mt-6 max-w-full">
                        <h2
                            className="
                                flex-none font-semibold 
                                leading-[1.1] tracking-[-0.03em] 
                                text-[clamp(1rem,2.5vw,2rem)] 
                                text-center
                                line-clamp-2
                            "
                            style={{ color: text }}
                        >
                            {title}
                        </h2>
                        <div
                            className="h-[3px] w-6 sm:w-10 rounded-full flex-none"
                            style={{
                                background: accent,
                                opacity: loaded ? 1 : 0,
                                transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                                transform: loaded ? "scaleX(1)" : "scaleX(0)",
                            }}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}