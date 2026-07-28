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
    const duration = `${Math.max(ads.length * 8, 16)}s`;

    const CockadeIcon = () => (
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-primary font-bold text-[7px] leading-none shrink-0" title="Escarapela del Perú">
            P
        </span>
    );

    return (
        <div
            className="w-full h-7 bg-primary text-white select-none overflow-hidden relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.333%); }
                }
            `}</style>

            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10"
                style={{ background: "linear-gradient(to right, rgba(15, 15, 15, 1) 0%, rgba(15, 15, 15, 0) 100%)" }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10"
                style={{ background: "linear-gradient(to left, rgba(15, 15, 15, 1) 0%, rgba(15, 15, 15, 0) 100%)" }}
            />

            <div
                ref={trackRef}
                className="flex items-center h-full w-max"
                style={{
                    animation: `marquee ${duration} linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                <div className="flex items-center gap-2.5 px-6 h-full text-[10px] font-medium tracking-wide whitespace-nowrap">
                    <CockadeIcon />
                    <span className="w-[1px] h-2.5 bg-white opacity-20"></span>
                </div>

                {repeated.map((ad, i) => {
                    const inner = (
                        <span className={`
                            flex items-center gap-2.5 px-6 h-full
                            text-[10px] font-medium tracking-wide whitespace-nowrap
                            transition-opacity duration-200
                            ${ad.linkTo ? "cursor-pointer group hover:opacity-75" : "cursor-default"}
                        `}>
                            <span className="uppercase tracking-[0.1em] text-[10px] font-semibold text-white">
                                {ad.title}
                            </span>

                            {ad.subtitle && (
                                <>
                                    <span className="opacity-30 font-light text-white">·</span>
                                    <span className="opacity-80 font-normal normal-case tracking-normal text-[10px] text-white">
                                        {ad.subtitle}
                                    </span>
                                </>
                            )}

                            {ad.linkTo && (
                                <ArrowRight
                                    size={10}
                                    className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 text-white"
                                    strokeWidth={2}
                                />
                            )}

                            <span className="ml-5 flex h-2.5 items-center">
                                <span className="w-[1px] h-full bg-white opacity-15"></span>
                                <span className="w-[1px] h-full bg-white opacity-30 mx-0.5"></span>
                                <span className="w-[1px] h-full bg-white opacity-15"></span>
                            </span>
                        </span>
                    );

                    return ad.linkTo ? (
                        <Link
                            key={i}
                            href={ad.linkTo}
                            prefetch={false}
                        >
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