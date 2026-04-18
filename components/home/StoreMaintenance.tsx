"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function StoreMaintenance() {
    // 15 de mayo de 2026 a las 00:00:00
    const targetDate = new Date("2026-05-15T00:00:00").getTime();
    
    const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(true);

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
                setOpen(false);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!isMounted) return null;
    if (targetDate - new Date().getTime() <= 0) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                className=""
                showCloseButton={true}
            >
                <div className="flex flex-col items-center p-8 md:p-14">
                    <DialogHeader className="flex flex-col items-center space-y-4">
                        <div className="inline-flex items-center gap-2 text-[var(--color-action-primary)] font-bold text-xs uppercase tracking-widest">
                            Mantenimiento Programado
                        </div>
                        
                        <DialogTitle className="text-4xl md:text-5xl font-black text-[var(--color-text-primary)] text-center tracking-tight leading-tight">
                            Estamos mejorando <br/>
                            <span className="text-[var(--color-action-primary)]">para ti.</span>
                        </DialogTitle>

                        <DialogDescription className="text-[var(--color-text-secondary)] text-center text-sm md:text-base max-w-sm">
                            Nos encontramos en una renovación profunda de nuestra tienda. Volvemos el <strong>15 de mayo</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Cronómetro Premium */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4 w-full my-10">
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
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-action-primary)] hover:text-[var(--color-text-inverse)] transition-all duration-300 border border-[var(--color-border-default)] shadow-sm hover:-translate-y-1"
                                    title={item.name}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Barra de progreso inferior */}
                <div className="h-1.5 w-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                    <div className="h-full bg-[var(--color-action-primary)] w-full animate-pulse" />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-full aspect-square bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] flex items-center justify-center mb-2 rounded-2xl">
                <span className="text-xl md:text-3xl font-black text-[var(--color-text-primary)]">
                    {value.toString().padStart(2, "0")}
                </span>
            </div>
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                {label}
            </span>
        </div>
    );
}