// File: src/components/banner/CarouselDot.tsx
"use client";

import { useEffect, useRef } from "react";

interface DotProps {
    onClick?: () => void;
    active?: boolean;
    autoPlaySpeed?: number;
    index?: number;
    carouselState?: { currentSlide: number };
}

export function CarouselDot({ onClick, active, autoPlaySpeed = 5000 }: DotProps) {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) return;

        if (active) {
            bar.style.transition = "none";
            bar.style.transform = "scaleX(0)";
            bar.style.transformOrigin = "left";

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bar.style.transition = `transform ${autoPlaySpeed}ms linear`;
                    bar.style.transform = "scaleX(1)";
                });
            });
        } else {
            bar.style.transition = "none";
            bar.style.transform = "scaleX(0)";
        }
    }, [active, autoPlaySpeed]);

    return (
        <button
            onClick={onClick}
            aria-label={active ? "Slide actual" : "Ir a slide"}
            className={`
                relative overflow-hidden rounded-full cursor-pointer
                transition-all duration-500 ease-out
                ${active
                    ? "w-8 md:w-10 h-[5px] md:h-[6px]"
                    : "w-[5px] md:w-[6px] h-[5px] md:h-[6px] hover:scale-125"
                }
            `}
            style={{
                backgroundColor: active
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(255,255,255,0.25)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.2)",
            }}
        >
            {/* Barra de progreso interna */}
            <div
                ref={barRef}
                className="absolute inset-0 rounded-full"
                style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    transform: "scaleX(0)",
                    transformOrigin: "left",
                    willChange: "transform",
                }}
            />
        </button>
    );
}