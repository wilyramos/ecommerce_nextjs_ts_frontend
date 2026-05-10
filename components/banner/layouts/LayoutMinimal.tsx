"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

type Props = {
    banner: SliderBanner;
};

export default function LayoutMinimal({ banner }: Props) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";

    const colors = {
        bg: design.bgColor ?? (isDark ? "#0a0a0f" : "#f8f8fc"),
        text: design.textColor ?? (isDark ? "#f0f0f5" : "#0d0d14"),
        muted: design.textMutedColor ?? (isDark ? "#f5f5f7" : "#5A5A5A"),
        accent: design.accentColor ?? (isDark ? "#F97316" : "#F97316"),
    };

    

    const fadeUp = (delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const discountPct =
        price?.compare && price?.current
            ? Math.round(((price.compare - price.current) / price.compare) * 100)
            : null;

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            className="banner-slot group relative overflow-hidden flex flex-col lg:flex-row items-center w-full"
            style={{ backgroundColor: colors.bg }}
        >
            {/* ── Columna Imagen (Orden 2 en LG para que aparezca a la derecha) ── */}
            <div
                className="
                    relative z-10
                    order-1 lg:order-2
                    w-full lg:w-[52%]
                    h-[50%] lg:h-full
                    flex items-center justify-center
                    overflow-hidden
                "
            >
                <div
                    className="
                        relative
                        w-[70%] sm:w-[60%] lg:w-[85%]
                        h-[85%]
                        transition-all duration-1000 ease-out
                    "
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? "scale(1) rotate(0deg)" : "scale(0.9) rotate(-2deg)",
                    }}
                >
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "contain"}
                        borderStyle={media.border ?? "none"}
                        priority
                        sizes="(max-width: 1024px) 75vw, 45vw"
                        className="select-none drop-shadow-xl group-hover:drop-shadow-2xl transition-all duration-500"
                    />
                </div>
            </div>

            {/* ── Columna Texto ── */}
            <div
                className="
                    relative z-10
                    order-2 lg:order-1
                    flex flex-col items-center justify-center
                    w-full lg:w-[48%]
                    px-8 sm:px-12 lg:px-16 xl:px-24
                    pb-10 lg:pb-0
                    text-center lg:text-left
                "
                style={{ color: colors.text }}
            >
                {/* Badges Minimalistas */}
                <div
                    className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-5 md:mb-6"
                    style={fadeUp(0.1)}
                >
                    {subtitle && (
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.25em] py-1 border-b-2"
                            style={{ borderColor: colors.accent }}
                        >
                            {subtitle}
                        </span>
                    )}
                    {discountPct && (
                        <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded"
                            style={{
                                backgroundColor: isDark ? "#ffffff20" : "#00000010",
                                color: colors.text
                            }}
                        >
                            {discountPct}% OFF
                        </span>
                    )}
                </div>

                {title && (
                    <h2
                        className="w-full text-[clamp(1.8rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.04em] mb-4 md:mb-6"
                        style={{ color: colors.text, ...fadeUp(0.2) }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="max-w-[40ch] text-[14px] sm:text-[15px] leading-relaxed mb-6 md:mb-8 font-light"
                        style={{ color: colors.muted, ...fadeUp(0.3) }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div style={fadeUp(0.4)} className="flex-none lg:self-start">
                        <SliderPrice
                            price={price}
                            color={colors.text}
                            accentColor={colors.accent}
                            isDark={isDark}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}