// File: frontend/components/banner/layouts/LayoutMediaLeft.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { H2, P, Small, BadgeText } from "@/components/ui/TypographyStore";

export default function LayoutMediaLeft({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, terms, price, destUrl, openInNewTab } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#a8a8a8" : "#0f0f0f");
    const accent = design.accentColor ?? "#ff6000";

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(10px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const content = (
        <div
            className="banner-slot group relative w-full h-full overflow-hidden select-none"
            style={{ backgroundColor: bg }}
        >
            <div className="w-full h-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row">
                {media?.imageUrl && (
                    <div
                        className="w-full flex-1 md:h-full md:w-1/2 relative pointer-events-none overflow-hidden"
                        style={{
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.6s ease",
                        }}
                    >
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={media.imageUrl}
                                alt={title || "Slider Banner Content"}
                                fill
                                className={`w-full h-full ${media.mobileImageUrl ? "max-md:hidden" : ""} ${
                                    media.objectFit === "contain" ? "object-contain" : "object-cover"
                                }`}
                                sizes="(max-width: 1152px) 100vw, 576px"
                                priority
                                unoptimized
                            />

                            {media.mobileImageUrl && (
                                <Image
                                    src={media.mobileImageUrl}
                                    alt={title || "Slider Banner Content Mobile"}
                                    fill
                                    className="md:hidden w-full h-full object-cover"
                                    sizes="100vw"
                                    priority
                                    unoptimized
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="w-full md:w-1/2 flex flex-col justify-center p-5 sm:p-6 md:p-12 z-10 box-border shrink-0">
                    <div className="flex flex-col gap-0.5 md:gap-2 w-full">
                        {subtitle && (
                            <div style={fadeUp(0.1)}>
                                <BadgeText
                                    className="uppercase tracking-wider"
                                    style={{ color: accent }}
                                >
                                    {subtitle}
                                </BadgeText>
                            </div>
                        )}

                        {title && (
                            <div style={fadeUp(0.18)}>
                                <H2
                                    className="text-lg sm:text-2xl md:text-3xl font-medium uppercase leading-tight line-clamp-2 md:line-clamp-3 text-balance"
                                    style={{ color: isDark ? "#ffffff" : "#0f0f0f" }}
                                >
                                    {title}
                                </H2>
                            </div>
                        )}

                        {description && (
                            <div style={fadeUp(0.28)}>
                                <P
                                    className="text-xs sm:text-sm leading-relaxed max-w-[40ch] line-clamp-1 md:line-clamp-3 mt-0.5"
                                    style={{ color: text, opacity: 0.8 }}
                                >
                                    {description}
                                </P>
                            </div>
                        )}

                        {price?.current !== undefined && price.current !== null && (
                            <div style={fadeUp(0.45)} className="mt-1 md:mt-4">
                                <SliderPrice
                                    price={price}
                                    textColor={text}
                                    accentColor={accent}
                                    isDark={isDark}
                                />
                            </div>
                        )}

                        {terms && (
                            <div style={fadeUp(0.50)} className="mt-1 md:mt-5 hidden sm:block">
                                <Small
                                    className="uppercase tracking-wider block"
                                    style={{ color: text, opacity: 0.5 }}
                                >
                                    {terms}
                                </Small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!destUrl) return content;

    return (
        <Link
            href={destUrl}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            className="w-full block"
            aria-label={title || "Slider Banner Link"}
        >
            {content}
        </Link>
    );
}