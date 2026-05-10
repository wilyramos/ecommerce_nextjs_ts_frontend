"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import SliderCountdownTimer from "../ui/SliderCountdownTimer";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutCountdown({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, countdown, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    if (!countdown?.endsAt) return null;

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
            // banner-slot: hereda altura definida en el carrusel via CSS variable
            className="banner-slot group relative flex items-stretch w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Imagen de fondo con fusión adaptativa ── */}
            <div
                className="absolute inset-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[50%] z-0"
                style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "scale(1)" : "scale(1.05)",
                    transition: "opacity 1.2s ease, transform 1.4s cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                <div className="absolute inset-0 w-full h-full">
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "none"}
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="transition-transform duration-[2000ms] ease-out group-hover:scale-[1.04]"
                        priority
                    />
                </div>

                {/* Overlay móvil: gradiente desde abajo */}
                <div
                    className="absolute inset-0 pointer-events-none sm:hidden z-10"
                    style={{
                        background: `linear-gradient(to top, ${bg} 10%, ${bg}b3 40%, transparent 100%)`,
                    }}
                />
                {/* Overlay desktop: gradiente desde la izquierda */}
                <div
                    className="absolute inset-0 pointer-events-none hidden sm:block z-10"
                    style={{
                        background: `linear-gradient(to left, transparent 0%, ${bg} 95%)`,
                    }}
                />
            </div>

            {/* ── Contenido ── */}
            <div
                className="
                    relative z-20
                    flex flex-col items-center justify-center text-center
                    w-full px-6
                    sm:w-[55%] sm:items-start sm:text-left sm:pl-12 md:pl-20 lg:pl-32
                    gap-3 sm:gap-4
                "
                style={{ color: text }}
            >
                {/* Badge */}
                {subtitle && (
                    <div style={fadeUp(0.1)}>
                        <span
                            className="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase px-3 py-[5px] rounded-full"
                            style={{
                                color: accent,
                                background: `${accent}15`,
                                border: `1px solid ${accent}30`,
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            {subtitle}
                        </span>
                    </div>
                )}

                {/* Título */}
                {title && (
                    <h2
                        className="font-bold leading-[1.05] tracking-[-0.03em] text-[clamp(1.8rem,5vw,3.8rem)] max-w-[15ch]"
                        style={fadeUp(0.2)}
                    >
                        {title}
                    </h2>
                )}

                {/* Descripción */}
                {description && (
                    <p
                        className="text-[12px] sm:text-[14px] leading-relaxed max-w-[35ch] line-clamp-2 sm:line-clamp-3"
                        style={{ color: muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                {/* Timer */}
                <div
                    className="my-1 sm:my-2 w-full flex justify-center sm:justify-start"
                    style={fadeUp(0.4)}
                >
                    <SliderCountdownTimer
                        endsAt={countdown.endsAt}
                        label={countdown.label}
                        showDays={countdown.showDays}
                        theme={design.theme}
                        accentColor={accent}
                    />
                </div>

                <div
                    className="flex flex-col items-center sm:items-start gap-4 mt-2"
                    style={fadeUp(0.5)}
                >
                    {price?.current !== undefined && (
                        <SliderPrice price={price}
                            color={text}
                            accentColor={accent}
                            isDark={isDark}
                        />
                    )}
                </div>
            </div>
        </Link>
    );
}