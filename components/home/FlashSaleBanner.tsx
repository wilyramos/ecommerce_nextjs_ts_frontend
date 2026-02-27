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

    if (!mounted) return <div className="min-h-[360px] bg-[var(--store-surface)]" />;

    return (
        <div className="relative flex flex-col justify-center p-10 md:p-14 bg-[var(--store-bg)] border-b md:border-b-0 md:border-r border-[var(--store-border)] min-h-[360px] bg">
            <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-[var(--store-primary)] font-semibold text-xs uppercase tracking-tight">
                    <Timer className="w-4 h-4" /> Oferta del día
                </div>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--store-text)] leading-[1.1]">
                    Precios fugaces. <br />
                    <span className="text-[var(--store-text-muted)]">Oportunidad única.</span>
                </h2>

                <div className="flex items-center gap-8 pt-4">
                    <Link href="/ofertas" className="px-2 py-2 rounded-full bg-[var(--store-primary)] text-[var(--store-primary-text)] font-medium transition-all hover:bg-[var(--store-primary-hover)] hover:scale-[1.02] text-xs">
                        Ver ofertas
                    </Link>
                    <div className="flex gap-4 border-l border-[var(--store-border)] pl-8">
                        <TimeBox val={timeLeft.hours} unit="H" />
                        <TimeBox val={timeLeft.minutes} unit="M" />
                        <TimeBox val={timeLeft.seconds} unit="S" active />
                    </div>
                </div>
            </div>
        </div>
    );
}

const TimeBox = ({ val, unit, active }: { val: number; unit: string; active?: boolean }) => (
    <div className="text-center">
        <div className={`text-xl font-bold tabular-nums ${active ? "text-[var(--store-primary)]" : "text-[var(--store-text)]"}`}>
            {val.toString().padStart(2, "0")}
        </div>
        <div className="text-[10px] text-[var(--store-text-muted)] font-bold">{unit}</div>
    </div>
);