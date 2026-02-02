"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroFlashSale() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      const diff = endOfDay.getTime() - now.getTime();

      if (diff > 0) {
        return {
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        };
      }
      return { hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full bg-[var(--store-bg)]">
      <div className="mx-auto">
        <div className="relative overflow-hidden border border-[var(--store-border)] bg-[var(--store-surface)] isolate">
          {/* Glow reducido */}
          <div
            className="absolute top-[-40%] right-[-10%] md:right-[10%] w-[420px] h-[420px] rounded-full blur-[90px] -z-10 opacity-20 pointer-events-none"
            style={{ backgroundColor: "var(--store-primary)" }}
          />

          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-6 md:px-12 md:py-8 gap-6 max-w-7xl mx-auto">
            {/* IZQUIERDA */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full border border-[var(--store-border)] bg-[var(--store-bg)] backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "var(--store-primary)" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "var(--store-primary)" }}
                  />
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[var(--store-text)] leading-tight">
                Precios fugaces.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--store-primary)] to-[var(--store-primary-hover)]">
                  Oportunidad única.
                </span>
              </h2>

              <p className="text-sm md:text-base text-[var(--store-text-muted)] max-w-md mx-auto md:mx-0">
                Descuentos que desaparecen hoy. Aprovecha antes de medianoche.
              </p>

              <div>
                <Link
                  href="/ofertas"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium text-sm transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "var(--store-primary)" }}
                >
                  Ver ofertas
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* DERECHA: RELOJ COMPACTO */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[var(--store-bg)]/50 border border-[var(--store-border)] backdrop-blur-sm">
                <TimeCard value={timeLeft.hours} label="Horas" />
                <TimeCard value={timeLeft.minutes} label="Minutos" />
                <TimeCard value={timeLeft.seconds} label="Segundos" isActive />
              </div>
              <p className="text-center mt-2 text-[10px] font-medium text-[var(--store-text-muted)] uppercase tracking-widest">
                Tiempo restante
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimeCard({
  value,
  label,
  isActive = false,
}: {
  value: number;
  label: string;
  isActive?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-16 h-20 md:w-20 md:h-24 rounded-xl border transition-all
        ${
          isActive
            ? "bg-[var(--store-surface)] border-[var(--store-primary)]"
            : "bg-[var(--store-surface)] border-[var(--store-border)]"
        }`}
    >
      <span
        className={`text-2xl md:text-3xl font-bold tabular-nums leading-none ${
          isActive
            ? "text-[var(--store-primary)]"
            : "text-[var(--store-text)]"
        }`}
      >
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[9px] md:text-[10px] font-semibold text-[var(--store-text-muted)] uppercase">
        {label}
      </span>
    </div>
  );
}
