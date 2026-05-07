"use client";

import Link        from "next/link";
import Image       from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutMinimal({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

    const isDark = design.theme !== "light";
    const bg     = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text   = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");

    return (
        <Link href={destUrl}
            className="relative flex items-center w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{ backgroundColor: bg }}>

            {/* Resplandor suave detrás del producto */}
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
                style={{
                    background: isDark
                        ? `radial-gradient(circle, ${accent}18 0%, transparent 70%)`
                        : `radial-gradient(circle, ${accent}12 0%, transparent 70%)`,
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 1s ease 0.3s",
                }} />

            {/* Panel texto — izquierda */}
            <div className="relative z-10 flex flex-col gap-3 pl-10 md:pl-16 w-1/2" style={{ color: text }}>
                {subtitle && (
                    <p className="text-xs font-semibold" style={{ color: accent,
                        opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}>
                        {subtitle}
                    </p>
                )}
                {title && (
                    <h2 className="text-[2.4rem] md:text-[3rem] font-semibold leading-[1.0] tracking-tight"
                        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)",
                        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.16s" }}>
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-[13px] leading-relaxed max-w-[22ch]"
                        style={{ color: muted, opacity: loaded ? 1 : 0, transition: "opacity 0.55s ease 0.26s" }}>
                        {description}
                    </p>
                )}
                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.33s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}
                
            </div>

            {/* Imagen producto — derecha flotante */}
            <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-[86%] w-[44%]"
                style={{
                    opacity:    loaded ? 1 : 0,
                    transform:  loaded ? "translateY(-50%) translateX(0)" : "translateY(-50%) translateX(20px)",
                    transition: "opacity 0.8s ease 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
                }}>
                <Image src={media.imageUrl} alt={media.altText} fill
                    className={`object-${media.objectFit ?? "contain"} drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]`}
                    priority />
            </div>
        </Link>
    );
}