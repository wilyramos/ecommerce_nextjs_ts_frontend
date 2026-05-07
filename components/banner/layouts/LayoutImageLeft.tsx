"use client";

import Link        from "next/link";
import Image       from "next/image";
import { useEffect, useState } from "react";
import SliderPrice from "../ui/SliderPrice";
import type { SliderBanner } from "@/src/schemas/slider.schema";

export default function LayoutImageLeft({ banner }: { banner: SliderBanner }) {
    const { design, media, title, subtitle, description, price, destUrl } = banner;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    const isDark      = design.theme !== "light";
    const bg          = design.bgColor        ?? (isDark ? "#000000" : "#ffffff");
    const text        = design.textColor      ?? (isDark ? "#f5f5f7" : "#1d1d1f");
    const muted       = design.textMutedColor ?? (isDark ? "#86868b" : "#6e6e73");
    const accent      = design.accentColor    ?? (isDark ? "#2997ff" : "#0071e3");
    const glassBg     = isDark ? "rgba(28,28,30,0.75)"    : "rgba(255,255,255,0.72)";
    const glassBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

    return (
        <Link
            href={destUrl}
            /**
             * Responsive heights:
             *   mobile  (< sm)  → 300 px  — imagen ocupa toda la altura; panel ocupa el 50 %
             *   tablet  (sm–md) → 380 px
             *   desktop (md+)   → 500 px
             *
             * En mobile el panel se convierte en una franja horizontal en la parte inferior
             * (position absolute, inset-x-0 bottom-0) para no tapar la imagen por completo.
             */
            className="relative flex items-stretch w-full h-[360px] sm:h-[460px] md:h-[600px] overflow-hidden group"
            style={{ backgroundColor: bg }}
        >
            {/* Imagen a sangre completa */}
            <Image
                src={media.imageUrl}
                alt={media.altText}
                fill
                className={`object-${media.objectFit ?? "cover"} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]`}
                priority
            />

            {/* ── Panel glass ──────────────────────────────────────────────────
                Mobile  : franja inferior (80 % ancho, centrada, borde superior)
                Desktop : columna derecha fija (40 % ancho)
            ───────────────────────────────────────────────────────────────── */}
            <div
                className={[
                    /* posición & dimensiones */
                    "absolute flex flex-col justify-center gap-3",
                    /* mobile: franja inferior */
                    "bottom-0 left-0 right-0 px-5 py-5 border-t",
                    /* sm+: panel lateral derecho */
                    "sm:inset-y-0 sm:left-auto sm:right-0 sm:bottom-auto sm:top-0",
                    "sm:w-[46%] sm:px-7 sm:py-0 sm:border-t-0 sm:border-l",
                    /* md+: panel un poco más estrecho */
                    "md:w-[40%] md:px-10 md:gap-4",
                ].join(" ")}
                style={{
                    backgroundColor: glassBg,
                    borderColor:     glassBorder,
                    backdropFilter:         "blur(24px) saturate(180%)",
                    WebkitBackdropFilter:   "blur(24px) saturate(180%)",
                    color:     text,
                    opacity:   loaded ? 1 : 0,
                    transform: loaded ? "translateX(0)" : "translateX(20px)",
                    transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s",
                }}
            >
                {subtitle && (
                    <p
                        className="text-[10px] font-semibold uppercase tracking-[0.35em] truncate"
                        style={{ color: accent }}
                    >
                        {subtitle}
                    </p>
                )}

                {title && (
                    <h2 className="text-lg sm:text-xl md:text-[2rem] font-semibold leading-[1.15] tracking-tight line-clamp-3">
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="text-[11px] md:text-[12px] leading-relaxed line-clamp-3"
                        style={{ color: muted }}
                    >
                        {description}
                    </p>
                )}

                {price?.current !== undefined && <SliderPrice price={price} />}

                {/* Separador */}
                <div className="h-px w-full" style={{ backgroundColor: glassBorder }} />
            </div>
        </Link>
    );
}