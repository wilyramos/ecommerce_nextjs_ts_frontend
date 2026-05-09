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
                transition-all duration-300 ease-in-out
                ${active
                    ? "w-8 h-1.5 bg-white/20" 
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }
            `}
        >
            <div
                ref={barRef}
                className="absolute inset-0 bg-white origin-left rounded-full will-change-transform"
                style={{ transform: "scaleX(0)" }}
            />
        </button>
    );
}