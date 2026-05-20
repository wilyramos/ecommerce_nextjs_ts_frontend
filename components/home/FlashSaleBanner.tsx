"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";

export default function HeroFlashSale() {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setMounted(true);
        const calculate = () => {
            const now = new Date();
            const diff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime() - now.getTime();
            return diff > 0 ? {
                hours: Math.floor((diff / 36e5) % 24),
                minutes: Math.floor((diff / 6e4) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            } : { hours: 0, minutes: 0, seconds: 0 };
        };
        const timer = setInterval(() => setTimeLeft(calculate()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return <div className="min-h-[360px] bg-background-secondary" />;

    return (
        <Link
            href="/ofertas"
            className="group relative flex flex-col justify-center p-6 bg-background min-h-[360px] overflow-hidden "
        >
            <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-action-cta font-semibold text-xs uppercase tracking-tight">
                    <Timer className="w-4 h-4 animate-pulse" /> Oferta del día
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-secondary leading-[1.1]">
                    Precios fugaces. <br />
                    <span className="text-muted group-hover:text-foreground transition-colors duration-300">
                        Oportunidad única.
                    </span>
                </h2>

                <div className="flex items-center gap-8 pt-4">
                    <span className="text-foreground font-medium group-hover:text-action-cta transition-colors duration-300 underline underline-offset-4 decoration-border group-hover:decoration-action-cta">
                        Ver ofertas
                    </span>
                    <div className="flex gap-4 border-l border-border pl-8">
                        <TimeBox val={timeLeft.hours} unit="H" />
                        <TimeBox val={timeLeft.minutes} unit="M" />
                        <TimeBox val={timeLeft.seconds} unit="S" active />
                    </div>
                </div>
            </div>
        </Link>
    );
}

const TimeBox = ({ val, unit, active }: { val: number; unit: string; active?: boolean }) => (
    <div className="text-center">
        <div className={`text-xl font-bold tabular-nums ${active ? "text-action-cta" : "text-foreground"}`}>
            {val.toString().padStart(2, "0")}
        </div>
        <div className="text-[10px] text-muted-foreground font-bold">{unit}</div>
    </div>
);