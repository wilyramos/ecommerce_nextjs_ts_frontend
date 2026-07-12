"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { TAdvertisement } from "@/src/schemas/advertisement.schema";
import { ArrowRight } from "lucide-react";

interface TopBarAdProps {
    ads: TAdvertisement[];
}

export default function TopBarAd({ ads }: TopBarAdProps) {
    const [paused, setPaused] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);

    if (!ads || ads.length === 0) return null;

    const repeated = [...ads, ...ads, ...ads];
    const duration = `${Math.max(ads.length * 7, 14)}s`;

    // Estilo para el icono de la Escarapela (simulado con bordes y pseudo-elementos si fuera necesario más complejo,
    // pero aquí usaremos un emoji o un placeholder simple por brevedad en el código).
    const CockadeIcon = () => (
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white border border-red-700 text-red-600 font-bold text-[8px] leading-none shrink-0" title="Escarapela del Perú">
            P
        </span>
    );

    return (
        <div
            className="w-full h-9 bg-red-600 text-white select-none overflow-hidden relative shadow-inner border-b border-red-700" // Rojo vibrante, texto blanco, sombra interior para profundidad
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-33.333%); }
                }
            `}</style>

            {/* Fade edges con color rojo para difuminar */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
                style={{ background: "linear-gradient(to right, rgba(220, 38, 38, 1) 0%, rgba(220, 38, 38, 0) 100%)" }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
                style={{ background: "linear-gradient(to left, rgba(220, 38, 38, 1) 0%, rgba(220, 38, 38, 0) 100%)" }}
            />

            <div
                ref={trackRef}
                className="flex items-center h-full w-max"
                style={{
                    animation: `marquee ${duration} linear infinite`,
                    animationPlayState: paused ? "paused" : "running",
                }}
            >
                {/* Icono temático antes del marquee */}
                <div className="flex items-center gap-3 px-8 h-full text-[11px] font-medium tracking-wide whitespace-nowrap">
                    <CockadeIcon />
                    <span className="w-[1px] h-3 bg-white opacity-20"></span>
                </div>

                {repeated.map((ad, i) => {
                    const inner = (
                        <span className={`
                            flex items-center gap-3 px-8 h-full
                            text-[11px] font-medium tracking-wide whitespace-nowrap
                            transition-opacity duration-200
                            ${ad.linkTo ? "cursor-pointer group hover:opacity-85" : "cursor-default"}
                        `}>

                            <span className="uppercase tracking-[0.14em] text-[11px] font-bold text-white">
                                {ad.title}
                            </span>

                            {ad.subtitle && (
                                <>
                                    <span className="opacity-40 font-light text-white">·</span>
                                    <span className="opacity-90 font-normal normal-case tracking-normal text-[10.5px] text-white">
                                        {ad.subtitle}
                                    </span>
                                </>
                            )}

                            {ad.linkTo && (
                                <ArrowRight
                                    size={11}
                                    className="shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 text-white"
                                    strokeWidth={2.5}
                                />
                            )}

                            {/* Separador temático (línea delgada con colores de la bandera) */}
                            <span className="ml-7 flex h-3 items-center">
                                <span className="w-[1px] h-full bg-white opacity-20"></span>
                                <span className="w-[1px] h-full bg-white opacity-40"></span>
                                <span className="w-[1px] h-full bg-white opacity-20"></span>
                            </span>
                        </span>
                    );

                    return ad.linkTo ? (
                        <Link
                            key={i}
                            href={ad.linkTo}
                            prefetch={false}
                        >
                            {inner}
                        </Link>
                    ) : (
                        <div key={i}>{inner}</div>
                    );
                })}
            </div>
        </div>
    );
}