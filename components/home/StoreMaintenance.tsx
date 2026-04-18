"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import Logo from "../ui/Logo";

export default function StoreMaintenance() {
    const targetDate = new Date("2026-05-15T00:00:00").getTime();
    const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(true);

    const social = [
        { icon: <FaFacebookF size={14} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={14} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={14} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="sr-only">Mantenimiento de la tienda</DialogTitle>
            <DialogContent
                className=""
                showCloseButton={true}
            >

                {/* Acento lateral sutil */}
                <div className="absolute left-0 top-0 w-1.5 h-full bg-[var(--color-accent-warm)] opacity-80" />

                <div className="p-8 md:p-14 space-y-12">
                    {/* Sección Superior: Editorial */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="h-[1px] w-8 bg-[var(--color-accent-warm)]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-accent-warm)]">
                                Estamos en mantenimiento.                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-light text-[var(--color-text-primary)] leading-[1.1] tracking-tighter">
                            Estamos <br />
                            <span className="font-bold">mejorando.</span>
                        </h2>

                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-[280px]">
                            Estamos haciendo mejoras para ofrecerte una experiencia de compra aún mejor.
                            <span className="block mt-2 font-bold text-[var(--color-text-primary)]">
                                ¡Vuelve pronto para descubrir lo que tenemos preparado!
                            </span>
                        </p>
                    </div>

                    {/* Countdown: Lineal y Minimalista */}
                    <div className="flex items-baseline gap-8">
                        <LineTimeBlock value={timeLeft.dias} label="D" />
                        <span className="text-[var(--color-border-default)] font-thin text-2xl">/</span>
                        <LineTimeBlock value={timeLeft.horas} label="H" />
                        <span className="text-[var(--color-border-default)] font-thin text-2xl">/</span>
                        <LineTimeBlock value={timeLeft.minutos} label="M" />
                        <span className="text-[var(--color-border-default)] font-thin text-2xl">/</span>
                        <LineTimeBlock value={timeLeft.segundos} label="S" isWarm />
                    </div>

                    {/* Footer: Redes */}
                    <div className="flex items-center justify-between pt-8 border-t border-[var(--color-border-subtle)]">
                        <div className="flex gap-6">
                            {social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-text-tertiary)]">
                            <Logo />
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function LineTimeBlock({ value, label, isWarm }: { value: number; label: string; isWarm?: boolean }) {
    return (
        <div className="flex flex-col">
            <span className={`text-3xl md:text-4xl font-bold tabular-nums tracking-tighter ${isWarm ? 'text-[var(--color-accent-warm)]' : 'text-[var(--color-text-primary)]'}`}>
                {value.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] font-black text-[var(--color-text-tertiary)] mt-1">
                {label}
            </span>
        </div>
    );
}