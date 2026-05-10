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
    const muted = design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#F97316");

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

            {/* Rampa inferior de contraste mejorada */}
            <div
                className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
                style={{
                    height: "75%",
                    background: `linear-gradient(to top, 
                        ${bg} 0%, 
                        ${bg}cc 40%, 
                        ${bg}44 70%, 
                        transparent 100%)`,
                }}
            />

            {/* ── Contenido Centrado ── */}
            <div className="
                relative z-20 w-full
                flex flex-col items-center justify-end text-center
                px-6 pb-12
                sm:px-10 sm:pb-16
                md:justify-center md:pb-0
            ">
                <div
                    className="
                        flex flex-col items-center
                        w-full
                        max-w-[22rem] sm:max-w-[36rem] md:max-w-2xl lg:max-w-3xl
                        md:translate-y-[15%]
                    "
                    style={{ color: text }}
                >
                    {subtitle && (
                        <div className="mb-2" style={fadeUp(0.1)}>
                            <span
                                className="
                                    inline-block 
                                    text-[10px] sm:text-[12px] 
                                    font-black uppercase 
                                    px-2 py-1
                
                                "
                                style={{
                                    color: isDark ? "#fff" : text,
                                    background: `${accent}`,
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    )}

                    {title && (
                        <h2
                            className="font-black leading-[1] tracking-[-0.05em] text-[clamp(2.3rem,8vw,5.5rem)] mb-0"
                            style={fadeUp(0.2, {
                                transform: loaded
                                    ? "translateY(0px) scale(1)"
                                    : "translateY(25px) scale(0.94)",
                                transition: `opacity 0.9s ease 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s`,
                            })}
                        >
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p
                            className="
                                mt-2 md:mt-4 
                                text-[13px] sm:text-[15px] md:text-[17px] 
                                leading-relaxed max-w-[38ch] 
                                line-clamp-2 font-medium
                            "
                            style={{
                                color: muted,
                                ...fadeUp(0.35),
                                textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
                            }}
                        >
                            {description}
                        </p>
                    )}

                    {price?.current !== undefined && (
                        <div className="mt-2 md:mt-4" style={fadeUp(0.45)}>
                            <SliderPrice
                                price={price}
                                color={text}
                                accentColor={accent}
                                isDark={isDark}
                            />
                        </div>
                    )}

                    {/* Elemento decorativo inferior */}
                    <div className="mt-8 md:mt-10" style={fadeUp(0.55)}>
                        <div
                            className="w-12 h-1 rounded-full overflow-hidden"
                            style={{ background: `${accent}30` }}
                        >
                            <div
                                className="h-full w-full"
                                style={{
                                    background: accent,
                                    transform: loaded ? 'translateX(0)' : 'translateX(-100%)',
                                    transition: 'transform 1s ease 0.8s'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}