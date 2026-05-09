"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ImageBorder from "../ui/ImageBorder";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageCenterSplit({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#080808" : "#f5f5f7");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");
    const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    const leftFields = design.contentDistribution?.leftSide ?? ["subtitle", "title"];
    const rightFields = design.contentDistribution?.rightSide ?? ["description", "price"];

    const fadeSlide = (side: "left" | "right" | "up", delay: number): React.CSSProperties => ({
        opacity: loaded ? 1 : 0,
        transform: loaded
            ? "translate(0px, 0px)"
            : side === "up"
                ? "translateY(14px)"
                : `translateX(${side === "left" ? "-16px" : "16px"})`,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const renderField = (field: string, animationSide: "left" | "right" | "up", i: number) => {
        const delay = 0.1 + i * 0.12;

        switch (field) {
            case "subtitle":
                return subtitle && (
                    <div key="subtitle" style={fadeSlide(animationSide, delay)} className="flex-none max-w-full">
                        <span
                            className="inline-block text-[9px] sm:text-[10px] font-bold tracking-[0.25em] uppercase px-3 py-1.5 rounded-full line-clamp-1 truncate"
                            style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}25` }}
                        >
                            {subtitle}
                        </span>
                    </div>
                );
            case "title":
                return title && (
                    <div key="title" style={fadeSlide(animationSide, delay)} className="flex-none max-w-full">
                        <h2
                            className="font-bold leading-tight tracking-tight text-[clamp(1.1rem,2vw,2.2rem)] line-clamp-3"
                            style={{ color: text }}
                        >
                            {title}
                        </h2>
                    </div>
                );
            case "description":
                return description && (
                    <div key="description" style={fadeSlide(animationSide, delay)} className="flex-none max-w-full min-h-0">
                        <p
                            className="text-[11px] sm:text-[13px] leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-[28ch] mx-auto"
                            style={{ color: muted }}
                        >
                            {description}
                        </p>
                    </div>
                );
            case "price":
                return price?.current !== undefined && (
                    <div key="price" style={fadeSlide(animationSide, delay)} className="flex-none scale-[0.9] sm:scale-100">
                        <SliderPrice price={price} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Link
            href={destUrl}
            aria-label={title ?? "Ver oferta"}
            // banner-slot provee la altura desde el carrusel.
            className="banner-slot group relative block w-full overflow-hidden"
            style={{ backgroundColor: bg }}
        >
            {/* ── Desktop (≥ sm): 3 columnas ── */}
            <div className="hidden sm:flex absolute inset-0 w-full h-full">

                {/* Panel izquierdo */}
                <div
                    className="h-full flex flex-col items-center justify-center text-center gap-3 md:gap-4 flex-shrink-0 z-20 overflow-hidden"
                    style={{ width: "28%", borderColor: divider, paddingInline: "3%" }}
                >
                    {leftFields.map((f, i) => renderField(f, "left", i))}
                </div>

                {/* Imagen central */}
                <div className="relative flex-1 h-full overflow-hidden">
                    <div className="absolute inset-0 w-full h-full z-0">
                        <ImageBorder
                            src={media.imageUrl}
                            alt={media.altText}
                            fill
                            objectFit={media.objectFit ?? "cover"}
                            borderStyle={media.border ?? "none"}
                            sizes="50vw"
                            className="transition-transform duration-[2000ms] ease-out group-hover:scale-[1.03]"
                            priority
                        />
                    </div>
                   

                    
                </div>

                {/* Panel derecho */}
                <div
                    className="h-full flex flex-col items-center justify-center text-center gap-3 md:gap-4 flex-shrink-0 z-20 overflow-hidden"
                    style={{ width: "28%", borderColor: divider, paddingInline: "3%" }}
                >
                    {rightFields.map((f, i) => renderField(f, "right", i))}
                </div>
            </div>

            {/* ── Mobile (< sm): imagen de fondo + contenido superpuesto ── */}
            <div className="sm:hidden absolute inset-0 w-full h-full">
                <div className="absolute inset-0 w-full h-full z-0">
                    <ImageBorder
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        objectFit={media.objectFit ?? "cover"}
                        borderStyle={media.border ?? "none"}
                        sizes="100vw"
                        className="transition-transform duration-[1500ms] group-hover:scale-105"
                        priority
                    />
                </div>
                <div
                    className="absolute inset-0 z-10 pointer-events-none"
                    style={{ background: `linear-gradient(to top, ${bg} 20%, ${bg}d9 55%, transparent 100%)` }}
                />
            </div>

            <div
                className="sm:hidden relative z-20 flex flex-col justify-end items-center text-center gap-2.5 px-6 pb-5 pt-16 h-full w-full overflow-hidden"
                style={{ color: text }}
            >
                {[...leftFields, ...rightFields].map((f, i) => renderField(f, "up", i))}
            </div>
        </Link>
    );
}