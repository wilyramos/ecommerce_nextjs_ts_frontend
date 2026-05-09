"use client";

import Link from "next/link";
import Image from "next/image";

import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

type Props = {
    banner: SliderBanner;
};

export default function LayoutMinimal({ banner }: Props) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;

    const isDark = design.theme !== "light";

    const colors = {
        bg: design.bgColor ?? (isDark ? "#0a0a0f" : "#f8f8fc"),
        text: design.textColor ?? (isDark ? "#f0f0f5" : "#0d0d14"),
        muted: design.textMutedColor ?? (isDark ? "#7a7a8a" : "#6b6b80"),
        accent: "var(--color-accent-warm)",
    };

    const discountPct =
        price?.compare && price?.current
            ? Math.round(((price.compare - price.current) / price.compare) * 100)
            : null;

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            // banner-slot reemplaza las alturas fijas anteriores
            className="banner-slot group relative overflow-hidden flex flex-col lg:flex-row items-center w-full"
            style={{ backgroundColor: colors.bg }}
        >
            {/* ── Fondo atmosférico ── */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse 60% 60% at 75% 50%, rgba(255,100,20,0.07) 0%, transparent 70%),
                           radial-gradient(ellipse 40% 50% at 20% 80%, rgba(80,60,255,0.05) 0%, transparent 60%)`
                        : `radial-gradient(ellipse 60% 60% at 75% 50%, rgba(255,100,20,0.06) 0%, transparent 70%),
                           radial-gradient(ellipse 40% 50% at 10% 90%, rgba(100,80,255,0.04) 0%, transparent 60%)`,
                }}
            />

            {/* ── Grid decorativo (solo dark) ── */}
            {isDark && (
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />
            )}

            {/* ── Imagen: Mobile arriba / Desktop derecha ── */}
            <div
                className="
                    relative z-10
                    order-1 lg:order-2
                    w-full lg:w-[52%]
                    h-[55%] lg:h-full
                    flex items-center justify-center
                    overflow-hidden
                "
            >
                <div
                    aria-hidden
                    className="
                        absolute top-1/2 left-1/2
                        -translate-x-1/2 -translate-y-1/2
                        w-[55%] aspect-square rounded-full blur-3xl
                        opacity-20 transition-opacity duration-700
                        group-hover:opacity-30
                    "
                    style={{ backgroundColor: colors.accent }}
                />

                <div
                    className="
                        relative
                        w-[75%] sm:w-[65%] lg:w-[80%]
                        h-[90%]
                        transition-transform duration-700 ease-out
                        group-hover:scale-[1.03]
                    "
                >
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        priority
                        sizes="(max-width: 1024px) 75vw, 45vw"
                        className={`object-${media.objectFit ?? "contain"} select-none drop-shadow-2xl`}
                    />
                </div>
            </div>

            <div
                className="
                    relative z-10
                    order-2 lg:order-1
                    flex flex-col items-center justify-center
                    w-full lg:w-[48%]
                    px-6 sm:px-10 lg:px-12 xl:px-16
                    pb-8 lg:pb-0
                    gap-4 lg:gap-5
                    text-center lg:text-left
                "
            >
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                    {subtitle && (
                        <span className="inline-flex items-center rounded-full bg-[var(--color-accent-warm)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            {subtitle}
                        </span>
                    )}
                    {discountPct && (
                        <span
                            className="inline-flex items-center rounded-full border border-current px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] opacity-60"
                            style={{ color: colors.text }}
                        >
                            −{discountPct}%
                        </span>
                    )}
                </div>

                {title && (
                    <h2
                        className="w-full text-[clamp(1.9rem,5.5vw,3.8rem)] font-semibold leading-[0.92] tracking-[-0.04em] break-words"
                        style={{ color: colors.text }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="max-w-[38ch] text-sm sm:text-[0.95rem] leading-relaxed opacity-70"
                        style={{ color: colors.muted }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && (
                    <div className="mt-1">
                        <SliderPrice price={price} />
                    </div>
                )}
            </div>
        </Link>
    );
}