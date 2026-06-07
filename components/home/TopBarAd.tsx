"use client";
import Link from "next/link";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import { ArrowRight, Tag, Truck, Zap, Gift } from "lucide-react";

interface TopBarAdProps {
    ads: TAdvertisement[];
}

// Íconos rotativos para dar contexto visual a cada aviso
const ICONS = [Truck, Tag, Zap, Gift];

export default function TopBarAd({ ads }: TopBarAdProps) {
    if (!ads || ads.length === 0) return null;

    const repeated = [...ads, ...ads, ...ads];
    const duration = `${ads.length * 6}s`;

    return (
        <div className="w-full h-8 bg-action-cta text-action-cta-foreground select-none overflow-hidden relative">
            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0%); }
                    100% { transform: translateX(-33.333%); }
                }
                @keyframes marquee-paused {
                    0%   { transform: translateX(0%); }
                    100% { transform: translateX(-33.333%); }
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Fade edges para sensación de profundidad */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
                style={{ background: "linear-gradient(to right, var(--color-action-cta, #000) 0%, transparent 100%)" }} />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
                style={{ background: "linear-gradient(to left, var(--color-action-cta, #000) 0%, transparent 100%)" }} />

            <div
                className="marquee-track flex items-center h-full w-max"
                style={{ animation: `marquee ${duration} linear infinite` }}
            >
                {repeated.map((ad, i) => {
                    const ContentWrapper = ad.linkTo ? Link : "div";
                    const Icon = ICONS[i % ICONS.length];

                    return (
                        <ContentWrapper
                            key={i}
                            href={ad.linkTo || "#"}
                            className={`
                                flex items-center gap-2 px-10 h-full
                                text-[11px] font-semibold tracking-wide whitespace-nowrap
                                transition-opacity duration-150
                                ${ad.linkTo ? "hover:opacity-75 cursor-pointer group" : "cursor-default"}
                            `}
                        >
                            {/* Ícono contextual */}
                            <Icon size={12} className="shrink-0 opacity-80" strokeWidth={2.5} />

                            <span className="uppercase tracking-widest text-[10px] font-black">
                                {ad.title}
                            </span>

                            {ad.subtitle && (
                                <>
                                    <span className="opacity-40 text-[10px]">—</span>
                                    <span className="opacity-90 font-medium normal-case tracking-normal">
                                        {ad.subtitle}
                                    </span>
                                </>
                            )}

                            {ad.linkTo && (
                                <ArrowRight
                                    size={11}
                                    className="shrink-0 opacity-70 transition-transform duration-150 group-hover:translate-x-0.5"
                                    strokeWidth={2.5}
                                />
                            )}

                            {/* Divisor entre items */}
                            <span className="ml-8 opacity-20 text-xs">|</span>
                        </ContentWrapper>
                    );
                })}
            </div>
        </div>
    );
}