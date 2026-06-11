"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import { ArrowRight } from "lucide-react";

interface TopBarAdProps {
    ads: TAdvertisement[];
}

export default function TopBarAd({ ads }: TopBarAdProps) {
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    if (!ads || ads.length === 0) return null;

    const repeated = [...ads, ...ads, ...ads];
    const duration = `${Math.max(ads.length * 7, 14)}s`;

    return (
        <div
            className="w-full h-8 bg-foreground text-background select-none overflow-hidden relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.333%); }
                }
            `}</style>

            {/* Fade edges */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10"
                style={{ background: "linear-gradient(to right, var(--foreground, #000) 0%, transparent 100%)" }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10"
                style={{ background: "linear-gradient(to left, var(--foreground, #000) 0%, transparent 100%)" }}
            />

            <div
                ref={trackRef}
                className="flex items-center h-full w-max"
                style={{
                    animation: `marquee ${duration} linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {repeated.map((ad, i) => {
                    const inner = (
                        <span className={`
                            flex items-center gap-2.5 px-8 h-full
                            text-[10px] font-medium tracking-wide whitespace-nowrap
                            transition-opacity duration-200
                            ${ad.linkTo ? "cursor-pointer group hover:opacity-70" : "cursor-default"}
                        `}>
                            <span className="uppercase tracking-[0.12em] text-[10px] font-semibold opacity-90">
                                {ad.title}
                            </span>

                            {ad.subtitle && (
                                <>
                                    <span className="opacity-25 font-light">·</span>
                                    <span className="opacity-70 font-normal normal-case tracking-normal text-[10px]">
                                        {ad.subtitle}
                                    </span>
                                </>
                            )}

                            {ad.linkTo && (
                                <ArrowRight
                                    size={10}
                                    className="shrink-0 opacity-50 group-hover:opacity-90 group-hover:translate-x-0.5 transition-all duration-200"
                                    strokeWidth={2}
                                />
                            )}

                            <span className="ml-6 opacity-15 font-thin text-[10px]">|</span>
                        </span>
                    );

                    return ad.linkTo ? (
                        <Link key={i} href={ad.linkTo}>
                            {inner}
                        </Link>
                    ) : (
                        <div key={i}>{inner}</div>
                    );
                })}
            </div>
        </div>
    );
}