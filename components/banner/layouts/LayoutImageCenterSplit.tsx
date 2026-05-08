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

    const isDark = design.theme !== "light";
    const bg = design.bgColor ?? (isDark ? "#000000" : "#ffffff");
    const text = design.textColor ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent = design.accentColor ?? (isDark ? "#2997ff" : "#0071e3");
    const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

    const leftFields = design.contentDistribution?.leftSide ?? ["subtitle", "title"];
    const rightFields = design.contentDistribution?.rightSide ?? ["description", "price"];

    const renderField = (field: string, side: "left" | "right", i: number) => {
        const delay = 0.12 + i * 0.08;
        const x = side === "left" ? "-12px" : "12px";
        const style: React.CSSProperties = {
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : `translateX(${x})`,
            transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
        };

        if (field === "title" && title)
            return (
                <div key="title" style={style}>
                    <h2
                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight tracking-tight line-clamp-3"
                        style={{ color: text }}
                    >
                        {title}
                    </h2>
                </div>
            );
        if (field === "subtitle" && subtitle)
            return (
                <div key="subtitle" style={style}>
                    <p
className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.38em] text-center"                        style={{ color: accent }}
                    >
                        {subtitle}
                    </p>
                </div>
            );
        if (field === "description" && description)
            return (
                <div key="description" style={style}>
                    <p
                        className="text-[11px] sm:text-[12px] leading-relaxed line-clamp-4"
                        style={{ color: muted }}
                    >
                        {description}
                    </p>
                </div>
            );
        if (field === "price" && price?.current !== undefined)
            return (
                <div key="price" style={style}>
                    <SliderPrice price={price} />
                </div>
            );
        return null;
    };

    return (
        <Link
            href={destUrl}

            className="relative flex w-full overflow-hidden group
                        flex-col h-[360px] sm:h-[460px] md:h-[600px]
                        sm:flex-row sm:items-stretch"
            style={{ backgroundColor: bg }}
        >

          


            {/* Panel izquierdo */}
            <div
                className="relative z-10 flex flex-col items-center justify-center text-center gap-2 sm:gap-3
            w-full px-5 py-3 border-b
            sm:w-[26%] md:w-[28%] sm:px-7 md:px-10 sm:py-0 sm:border-b-0 sm:border-r
            order-2 sm:order-1"
                style={{ borderColor: divider }}
            >
                {leftFields.map((f, i) => renderField(f, "left", i))}
            </div>

            {/* Imagen central */}
            <div
                className="relative flex-1 overflow-hidden order-1 sm:order-2"
            >
                <Image
                    src={media.imageUrl}
                    alt={media.altText}
                    fill
                    className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]`}
                    priority
                />
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(to right, ${bg} 0%, transparent 20%, transparent 80%, ${bg} 100%)`,
                    }}
                />
            </div>

            {/* Panel derecho */}
            <div
                className="relative z-10 flex flex-col items-center justify-center text-center gap-2 sm:gap-3
            w-full px-5 py-3 border-t
            sm:w-[26%] md:w-[28%] sm:px-7 md:px-10 sm:py-0 sm:border-t-0 sm:border-l
            order-3"
                style={{ borderColor: divider }}
            >
                {rightFields.map((f, i) => renderField(f, "right", i))}
            </div>
        </Link>
    );
}