"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutDefault({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#F97316" : "#0071e3");

    return (
        <Link
            href={destUrl}
            className="relative flex items-center w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{ backgroundColor: bg }}
        >
            {/* Gradiente radial de fondo — calor sutil detrás del producto */}
            <div
                className="absolute right-0 top-0 w-[60%] h-full pointer-events-none"
                style={{
                    background: isDark
                        ? `radial-gradient(ellipse 70% 80% at 70% 50%, #1a1a2e 0%, transparent 70%)`
                        : `radial-gradient(ellipse 70% 80% at 70% 50%, #e8f4ff 0%, transparent 70%)`,
                }}
            />

            {/* Imagen — derecha, flotante con drop-shadow */}
            <div
                className="absolute right-0 top-0 h-full w-[52%]"
                style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded ? "translateX(0) scale(1)" : "translateX(30px) scale(0.97)",
                    transition: "opacity 0.8s ease 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
            >
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "contain"} drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]`}
                    priority
                />
            </div>

            {/* Panel texto — izquierda */}
            <div className="relative z-10 flex flex-col items-center text-center gap-3 px-10 md:px-16 max-w-[52%]" style={{ color: text }}>
                {subtitle && (
                    <p className="text-xs font-semibold" style={{
                        color: accent,
                        opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(8px)",
                        transition: "all 0.5s ease 0.2s"
                    }}>
                        {subtitle}
                    </p>
                )}
                {title && (
                    <h2 className="text-[2.6rem] md:text-[3.4rem] font-semibold leading-[1.0] tracking-tight"
                        style={{
                            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)",
                            transition: "all 0.6s ease 0.28s"
                        }}>
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-[13px] md:text-sm leading-relaxed mt-1" style={{
                        color: muted,
                        opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(8px)",
                        transition: "all 0.55s ease 0.36s"
                    }}>
                        {description}
                    </p>
                )}
                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.42s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}

            </div>
        </Link>
    );
}