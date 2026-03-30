"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function StoreMaintenance() {
    // 01 de mayo de 2026 a las 00:00:00
    const targetDate = new Date("2026-05-01T00:00:00").getTime();
    
    const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [isMounted, setIsMounted] = useState(false);
    // Ahora iniciamos siempre en true
    const [isVisible, setIsVisible] = useState(true);

    const social = [
        { icon: <FaFacebookF size={18} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={18} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={18} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
    ];

    useEffect(() => {
        setIsMounted(true);

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutos: Math.floor((difference / 1000 / 60) % 60),
                    segundos: Math.floor((difference / 1000) % 60),
                });
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    // Al quitar sessionStorage, solo cambiamos el estado local
    const handleClose = () => setIsVisible(false);

    if (!isMounted || !isVisible) return null;
    if (targetDate - new Date().getTime() <= 0) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop con desenfoque extremo */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl animate-in fade-in duration-500" />

            <div className="relative w-full max-w-2xl bg-white border border-[var(--store-border)] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-500">
                
                {/* Botón de Cierre (X) */}
                <button 
                    onClick={handleClose}
                    className="absolute top-6 right-6 w-10 h-10 bg-[var(--store-bg)] hover:bg-[var(--store-surface-hover)] rounded-full flex items-center justify-center text-[var(--store-text-muted)] hover:text-[var(--store-text)] transition-all z-20"
                >
                    <FaTimes size={18} />
                </button>

                <div className="flex flex-col items-center p-8 md:p-14">
                 

                    <h2 className="text-4xl md:text-5xl font-black text-[var(--store-text)] text-center tracking-tight mb-4 leading-tight">
                        Estamos mejorando <br/>
                        <span className="text-[var(--store-primary)]">para ti.</span>
                    </h2>

                    <p className="text-[var(--store-text-muted)] text-center text-sm md:text-base max-w-sm mb-10">
                        Nos encontramos en una renovación. Volvemos el <strong>1 de Mayo</strong>.
                    </p>

                    {/* Cronómetro Premium */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4 w-full mb-5">
                        <TimeBlock value={timeLeft.dias} label="Días" />
                        <TimeBlock value={timeLeft.horas} label="Hrs" />
                        <TimeBlock value={timeLeft.minutos} label="Min" />
                        <TimeBlock value={timeLeft.segundos} label="Seg" />
                    </div>

                    <div className="flex flex-col items-center gap-8 w-full">
                        <div className="flex items-center gap-4">
                            {social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--store-bg)] text-[var(--store-text-muted)] hover:bg-[var(--store-primary)] hover:text-white transition-all duration-300 border border-[var(--store-border)] shadow-sm hover:-translate-y-1"
                                    title={item.name}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>

                      
                    </div>
                </div>

                <div className="h-1.5 w-full bg-[var(--store-bg)] overflow-hidden">
                    <div className="h-full bg-[var(--store-primary)] w-full animate-pulse" />
                </div>
            </div>
        </div>
    );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full aspect-square bg-[var(--store-bg)] border border-[var(--store-border)] flex items-center justify-center mb-2">
                <span className="text-lg md:text-2xl font-black text-[var(--store-text)]">
                    {value.toString().padStart(2, "0")}
                </span>
            </div>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--store-text-muted)]">
                {label}
            </span>
        </div>
    );
}