"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageCenterSplit({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    /* ─── Tokens de diseño estandarizados ────────────────────────── */
    const isDark = design.theme !== "light";
    const bg     = design.bgColor        ?? (isDark ? "#080808" : "#f5f5f7");
    const text   = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted  = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");
    const divider = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

    const leftFields  = design.contentDistribution?.leftSide  ?? ["subtitle", "title"];
    const rightFields = design.contentDistribution?.rightSide ?? ["description", "price"];

    /* ─── Animación lateral escalonada ──────────────────────────── */
    const fadeSlide = (side: "left" | "right", delay: number): React.CSSProperties => ({
        opacity:    loaded ? 1 : 0,
        transform:  loaded ? "translateX(0px)" : `translateX(${side === "left" ? "-16px" : "16px"})`,
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    });

    const renderField = (field: string, side: "left" | "right", i: number) => {
        const delay = 0.1 + i * 0.12;

        switch (field) {
            case "subtitle":
                return subtitle && (
                    <div key="subtitle" style={fadeSlide(side, delay)}>
                        <span 
                            className="inline-block text-[10px] font-bold tracking-[0.3em] uppercase px-2.5 py-[4px] rounded-full"
                            style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}25` }}
                        >
                            {subtitle}
                        </span>
                    </div>
                );
            case "title":
                return title && (
                    <div key="title" style={fadeSlide(side, delay)}>
                        <h2 
                            className="font-bold leading-[1.1] tracking-tight text-[clamp(1.2rem,2.5vw,2.2rem)]"
                            style={{ color: text }}
                        >
                            {title}
                        </h2>
                    </div>
                );
            case "description":
                return description && (
                    <div key="description" style={fadeSlide(side, delay)}>
                        <p 
                            className="text-[12px] sm:text-[13px] leading-relaxed line-clamp-4 max-w-[24ch]"
                            style={{ color: muted }}
                        >
                            {description}
                        </p>
                    </div>
                );
            case "price":
                return price?.current !== undefined && (
                    <div key="price" style={fadeSlide(side, delay)}>
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
            className="group relative w-full overflow-hidden block h-[380px] sm:h-[460px] md:h-[600px]"
            style={{ backgroundColor: bg }}
        >
            {/* ════════════════════════════════════════════════════════
                DESKTOP (≥ sm) — Layout de 3 Columnas
            ════════════════════════════════════════════════════════ */}
            <div className="hidden sm:flex absolute inset-0">

                {/* Panel Izquierdo */}
                <div
                    className="h-full flex flex-col items-center justify-center text-center gap-4 flex-shrink-0 border-r"
                    style={{ width: "25%", borderColor: divider, paddingInline: "4%" }}
                >
                    {leftFields.map((f, i) => renderField(f, "left", i))}
                </div>

                {/* Imagen Central con Efecto de Profundidad */}
                <div className="relative flex-1 h-full overflow-hidden">
                    <Image
                        src={media.imageUrl}
                        alt={media.altText}
                        fill
                        sizes="50vw"
                        className={`object-${media.objectFit ?? "cover"} transition-transform duration-[2000ms] ease-out group-hover:scale-[1.05]`}
                        priority
                    />
                    {/* Fusión de bordes */}
                    <div className="absolute inset-y-0 left-0 w-32 pointer-events-none"
                         style={{ background: `linear-gradient(to right, ${bg}, transparent)` }} />
                    <div className="absolute inset-y-0 right-0 w-32 pointer-events-none"
                         style={{ background: `linear-gradient(to left, ${bg}, transparent)` }} />
                    
                    {/* CTA Central */}
                    <div
                        className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3"
                        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.6s" }}
                    >
                        <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, transparent, ${accent}80)` }} />
                        <span 
                            className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-wide transition-all duration-300 group-hover:gap-3"
                            style={{ color: accent }}
                        >
                            Explorar
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14m-7-7 7 7-7 7"/>
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Panel Derecho */}
                <div
                    className="h-full flex flex-col items-center justify-center text-center gap-4 flex-shrink-0 border-l"
                    style={{ width: "25%", borderColor: divider, paddingInline: "4%" }}
                >
                    {rightFields.map((f, i) => renderField(f, "right", i))}
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                MOBILE (< sm) — Layout Stack con Overlays
            ════════════════════════════════════════════════════════ */}
            <div className="sm:hidden absolute inset-0">
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1500ms] group-hover:scale-105`}
                    priority
                />
                <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, ${bg} 15%, ${bg}b3 50%, transparent 100%)` }}
                />
            </div>

            <div 
                className="sm:hidden absolute bottom-0 left-0 right-0 flex flex-col items-center text-center gap-3 px-8 pb-10"
                style={{ color: text }}
            >
                {/* En mobile combinamos ambos lados en un solo stack */}
                {[...leftFields, ...rightFields].map((f, i) => renderField(f, "left", i))}
                
                <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}>
                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold mt-2" style={{ color: accent }}>
                        Ver más
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14m-7-7 7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}