"use client";

import Link        from "next/link";
import Image       from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutSplitDiagonal({ banner }: { banner: SliderBanner }) {
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
            className="relative flex items-stretch w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{ backgroundColor: bg }}>

            {/* Imagen — lado derecho con clipPath */}
            <div className="absolute inset-0"
                style={{ clipPath: "polygon(42% 0, 100% 0, 100% 100%, 28% 100%)" }}>
                <Image src={media.imageUrl} alt={media.altText} fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-700 group-hover:scale-[1.03]`}
                    priority />
                {/* Fade izquierdo sobre la imagen */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(to right, ${bg} 0%, transparent 25%)` }} />
            </div>

            {/* Línea de corte — SVG preciso */}
            <svg className="absolute inset-0 z-20 w-full h-full pointer-events-none"
                preserveAspectRatio="none" viewBox="0 0 100 100">
                <line x1="42" y1="0" x2="28" y2="100"
                    stroke={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
                    strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Panel texto izquierdo */}
            <div className="relative z-10 flex flex-col justify-center gap-3.5 pl-10 md:pl-14 pr-6 max-w-[50%]"
                style={{ color: text }}>
                {subtitle && (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.38em]"
                        style={{ color: accent, opacity: loaded ? 1 : 0,
                        transform: loaded ? "none" : "translateY(8px)",
                        transition: "all 0.5s ease 0.1s" }}>
                        {subtitle}
                    </p>
                )}
                {title && (
                    <h2 className="text-4xl md:text-[3rem] font-semibold leading-[1.0] tracking-tight"
                        style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(12px)",
                        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.18s" }}>
                        {title}
                    </h2>
                )}
                {description && (
                    <p className="text-[13px] leading-relaxed max-w-[22ch]"
                        style={{ color: muted, opacity: loaded ? 1 : 0,
                        transition: "opacity 0.55s ease 0.28s" }}>
                        {description}
                    </p>
                )}
                {price?.current !== undefined && (
                    <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.34s" }}>
                        <SliderPrice price={price} />
                    </div>
                )}
               
            </div>
        </Link>
    );
}