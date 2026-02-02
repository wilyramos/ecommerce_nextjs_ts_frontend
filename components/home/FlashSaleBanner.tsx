"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FlashSaleBanner() {
    const [mounted, setMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Lógica del cronómetro (Mantenida igual)
    useEffect(() => {
        setMounted(true);
        const targetDate = new Date();
        targetDate.setHours(targetDate.getHours() + 12);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                targetDate.setHours(targetDate.getHours() + 24);
            } else {
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    return (
        <section className="py-8 px-4 md:px-6">
            <div className="max-w-[1200px] mx-auto">
                {/* Contenedor: Diseño "Bento" oscuro, típico de Apple Pro */}
                <div className="relative overflow-hidden rounded-[32px] bg-neutral-950 shadow-2xl">

                    {/* Background Glow sutil (Estilo Aurora) */}
                    <div className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-16 md:px-16 md:py-20 gap-12">

                        {/* 1. Texto: Jerarquía clara y tracking ajustado */}
                        <div className="text-center md:text-left space-y-6 flex-1">
                            <div className="space-y-2">
                                <span className="block text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
                                    Oferta por tiempo limitado
                                </span>
                                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
                                    Grandes productos.
                                    <br />
                                    <span className="text-neutral-500">Mejores precios.</span>
                                </h2>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
                                <Link
                                    href="/ofertas"
                                    className="group inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.02]"
                                >
                                    <span>Ver ofertas</span>
                                    <ArrowRight
                                        size={16}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </Link>
                                <p className="text-neutral-400 text-sm">
                                    Unidades limitadas.
                                </p>
                            </div>

                        </div>

                        {/* 2. Cronómetro: Tipografía limpia, sin cajas */}
                        <div className="flex items-end gap-2 md:gap-4">
                            <TimeBlock value={timeLeft.hours} label="Horas" />
                            <Separator />
                            <TimeBlock value={timeLeft.minutes} label="Min" />
                            <Separator />
                            <TimeBlock value={timeLeft.seconds} label="Seg" isSeconds />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Componente de número: Sin cajas, solo tipografía pura
function TimeBlock({ value, label, isSeconds = false }: { value: number; label: string, isSeconds?: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <span className={`text-5xl md:text-7xl font-medium tracking-tighter tabular-nums leading-none ${isSeconds ? 'text-blue-400' : 'text-white'}`}>
                {value.toString().padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] md:text-xs font-medium uppercase tracking-widest text-neutral-500">
                {label}
            </span>
        </div>
    );
}

// Separador visual minimalista
function Separator() {
    return (
        <span className="text-2xl md:text-4xl text-neutral-700 font-light mb-8 md:mb-10">
            :
        </span>
    );
}