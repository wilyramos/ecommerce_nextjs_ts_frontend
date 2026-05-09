"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageCenter({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#080808" : "#f5f5f7");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#999" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");

    const fadeUp = (delay: number, extra?: React.CSSProperties): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(16px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        ...extra,
    });

    const imgOpacity = media.objectFit === "contain" ? 0.9 : 1;

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            // banner-slot provee la altura desde el carrusel
            className="banner-slot group relative flex w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Imagen a sangre completa ── */}
            <div className="absolute inset-0 w-full h-full z-0" style={{ opacity: imgOpacity }}>
                <ImageBorder
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    objectFit={media.objectFit ?? "cover"}
                    borderStyle={media.border ?? "none"}
                    sizes="100vw"
                    className="transition-transform duration-[1800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    priority
                />
            </div>


            {/* Rampa inferior */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
                style={{
                    height: "65%",
                    background: isDark
                        ? `linear-gradient(to top, ${bg}f2 0%, ${bg}bb 35%, transparent 100%)`
                        : `linear-gradient(to top, ${bg}f0 0%, ${bg}aa 35%, transparent 100%)`,
                }}
            />

            {/* ── Contenido ── */}
            <div className="
                relative z-20 w-full
                flex flex-col items-center justify-end text-center
                px-6 pb-10
                sm:px-10 sm:pb-12
                md:justify-center md:pb-0
                md:px-12
            ">
                <div
                    className="
                        flex flex-col items-center
                        w-full
                        max-w-[20rem] sm:max-w-[34rem] md:max-w-2xl lg:max-w-3xl
                        md:translate-y-[10%]
                    "
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-3 md:mb-4" style={fadeUp(0.08)}>
                            <span
                                className="inline-block text-[10px] font-bold tracking-[0.32em] uppercase px-3 py-[5px] rounded-full"
                                style={{
                                    color: accent,
                                    background: `${accent}20`,
                                    border: `1px solid ${accent}35`,
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-semibold leading-[1.03] tracking-[-0.04em] text-[clamp(2.1rem,6.8vw,5rem)] mb-0"
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
                            className="mt-3 md:mt-4 text-[12px] sm:text-[13px] md:text-[14px] leading-[1.75] max-w-[34ch] line-clamp-2"
                            style={{ color: muted, ...fadeUp(0.28) }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div className="mt-3 md:mt-4" style={fadeUp(0.36)}>
                            <SliderPrice price={price} />
                        </div>
                    )}

                    <div className="mt-5 md:mt-6 flex flex-col items-center gap-3" style={fadeUp(0.44)}>
                        <div
                            className="w-8 h-px rounded-full"
                            style={{ background: `${accent}80` }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
}