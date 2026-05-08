"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import SliderCountdownTimer from "../ui/SliderCountdownTimer";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutCountdown({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, countdown, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

    if (!countdown?.endsAt) return null;

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#ff375f" : "#ff2d55");

    return (
        <Link
            href={destUrl}
            className="relative flex items-stretch w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{ backgroundColor: bg }}
        >
            <div
                className="absolute inset-0 sm:left-auto sm:right-0 sm:top-0 sm:h-full sm:w-[50%]"
            >
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-700 group-hover:scale-[1.03]`}
                    priority
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(to top, ${bg} 0%, ${bg}cc 30%, transparent 100%)`,
                    }}
                />
                <div
                    className="absolute inset-0 pointer-events-none hidden sm:block"
                    style={{ background: `linear-gradient(to left, transparent 50%, ${bg} 100%)` }}
                />
            </div>

            <div
                className={[
                    "flex flex-col items-center justify-center text-center gap-3",
                    "absolute inset-0 px-5 z-10",
                    "sm:relative sm:inset-auto",
                    "sm:gap-4",
                    "sm:px-8 sm:w-[56%]",
                    "md:px-16 md:gap-4",
                ].join(" ")}
                style={{ color: text }}
            >
                {subtitle && (
                    <span
                        className="inline-flex items-center px-3 py-1 rounded-full
                                    text-[10px] font-semibold uppercase tracking-widest"
                        style={{
                            backgroundColor: `${accent}18`,
                            color: accent,
                            border: `1px solid ${accent}40`,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.5s ease 0.08s",
                        }}
                    >
                        {subtitle}
                    </span>
                )}

                {title && (
                    <h2
                        className="text-2xl sm:text-3xl md:text-[3rem] font-semibold leading-[1.05] tracking-tight line-clamp-2"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transform: loaded ? "none" : "translateY(12px)",
                            transition: "all 0.65s cubic-bezier(0.16,1,0.3,1) 0.16s",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[12px] sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-3"
                        style={{
                            color: muted,
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.55s ease 0.26s",
                        }}
                    >
                        {description}
                    </p>
                )}

                <div
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "none" : "translateY(8px)",
                        transition: "all 0.6s ease 0.32s",
                    }}
                >
                    <SliderCountdownTimer
                        endsAt={countdown.endsAt}
                        label={countdown.label}
                        showDays={countdown.showDays}
                        theme={design.theme}
                        accentColor={accent}
                    />
                </div>

                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.42s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}