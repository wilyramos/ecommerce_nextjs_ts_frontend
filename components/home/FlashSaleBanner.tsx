"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroFlashSale() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const diff = endOfDay.getTime() - now.getTime();
      return diff > 0 ? {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      } : { hours: 0, minutes: 0, seconds: 0 };
    };

    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full py-6 bg-[var(--store-bg)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--store-surface)] border border-[var(--store-border)] shadow-sm">

          {/* Sutil gradiente de profundidad estilo Apple */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--store-bg)] opacity-50 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-14 gap-10">

            {/* LADO IZQUIERDO: CONTENIDO */}
            <div className="flex-1 text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[var(--store-primary)] fill-[var(--store-primary)]" />
                <span className="text-xs font-semibold text-[var(--store-primary)] uppercase tracking-wider">
                  Oferta de tiempo limitado
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--store-text)] tracking-tight leading-[1.1] mb-6">
                Precios especiales. <br />
                <span className="text-[var(--store-text-muted)]">Termina pronto.</span>
              </h2>

              <p className="text-[var(--store-text-muted)] text-lg md:text-xl font-medium max-w-md mx-auto md:mx-0 mb-8">
                Consigue tus favoritos con descuentos exclusivos antes de que el tiempo se agote.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">

                <Link
                  href="/ofertas"
                  className="group flex items-center gap-1 text-[var(--store-primary)] font-semibold hover:underline underline-offset-4"
                >
                  Ver ofertas
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* LADO DERECHO: CONTADOR MINIMALISTA */}
            <div className="relative z-10">
              <div className="flex items-end gap-3 md:gap-4 bg-[var(--store-bg)] p-8 rounded-[2.5rem] border border-[var(--store-border)]">
                <TimeSegment value={timeLeft.hours} label="Horas" />
                <span className="text-3xl font-light text-[var(--store-text-muted)] mb-6">:</span>
                <TimeSegment value={timeLeft.minutes} label="Minutos" />
                <span className="text-3xl font-light text-[var(--store-text-muted)] mb-6">:</span>
                <TimeSegment value={timeLeft.seconds} label="Segundos" highlight />
              </div>

              {/* Barra de progreso sutil */}
              <div className="mt-6 px-2">
                <div className="flex justify-between text-[11px] font-bold text-[var(--store-text-muted)] uppercase mb-2">
                  <span>Disponibilidad</span>
                  <span className="text-[var(--store-primary)]">Quedan pocas unidades</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--store-border)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--store-primary)] w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeSegment({ value, label, highlight = false }: { value: number; label: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`
        text-4xl md:text-5xl font-bold tabular-nums tracking-tighter
        ${highlight ? "text-[var(--store-primary)]" : "text-[var(--store-text)]"}
      `}>
        {value.toString().padStart(2, "0")}
      </div>
      <span className="text-[10px] font-bold text-[var(--store-text-muted)] uppercase mt-1 tracking-widest">
        {label}
      </span>
    </div>
  );
}