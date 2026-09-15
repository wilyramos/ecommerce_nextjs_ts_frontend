// File: frontend/components/ui/SpinnerLoadingV2.tsx
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SpinnerLoadingProps {
    message?: string;
    showMessage?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function SpinnerLoadingV2({
    message = "Cargando...",
    showMessage = true,
    size = "md",
    className
}: SpinnerLoadingProps) {
    // Retraso visual (200ms) para evitar parpadeos en cargas rápidas, un estándar de UX de Apple
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const sizeMap = {
        sm: "h-5 w-5",
        md: "h-8 w-8",
        lg: "h-10 w-10"
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-4 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                show ? "opacity-100" : "opacity-0",
                className
            )}
        >
            {/* Spinner minimalista estilo Apple (Anillo fino) */}
            <div className={cn("relative flex items-center justify-center text-text-tertiary", sizeMap[size])}>
                <svg
                    className="animate-spin w-full h-full"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Pista de fondo tenue */}
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="opacity-20"
                    />
                    {/* Segmento giratorio */}
                    <path
                        d="M12 2A10 10 0 0 1 22 12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="text-text-primary"
                    />
                </svg>
            </div>

            {showMessage && (
                <p className="text-[12px] font-medium tracking-tight text-text-secondary animate-pulse">
                    {message}
                </p>
            )}
        </div>
    );
}