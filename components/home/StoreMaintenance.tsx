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
        { icon: <FaFacebookF />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp />, href: "https://wa.me/51925054636", name: "WhatsApp" },
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
                className="
                    w-[92vw] sm:w-full 
                    max-w-md sm:max-w-lg md:max-w-2xl
                    p-0 overflow-hidden
                "
                showCloseButton
            >
                {/* Acento lateral */}
                <div className="absolute left-0 top-0 w-1 sm:w-1.5 h-full bg-[var(--color-accent-warm)]" />

                <div className="
                    p-6 sm:p-8 md:p-12 lg:p-14
                    space-y-8 sm:space-y-10 md:space-y-12
                ">
                    {/* Header */}
                    <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="h-[1px] w-6 sm:w-8 bg-[var(--color-accent-warm)]" />
                            <span className="
                                text-[9px] sm:text-[10px]
                                font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em]
                                text-[var(--color-accent-warm)]
                            ">
                                Estamos en mantenimiento.
                            </span>
                        </div>

                        <h2 className="
                            text-2xl sm:text-3xl md:text-5xl
                            font-light text-[var(--color-text-primary)]
                            leading-[1.1] tracking-tight
                        ">
                            Estamos <br />
                            <span className="font-bold">mejorando.</span>
                        </h2>

                        <p className="
                            text-xs sm:text-sm
                            text-[var(--color-text-secondary)]
                            leading-relaxed
                            max-w-full sm:max-w-xs md:max-w-sm
                        ">
                            Estamos haciendo mejoras para ofrecerte una experiencia de compra aún mejor.
                            <span className="block mt-2 font-bold text-[var(--color-text-primary)]">
                                ¡Vuelve pronto para descubrir lo que tenemos preparado!
                            </span>
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="
                        flex items-center justify-between
                        sm:justify-start sm:gap-6 md:gap-8
                        text-center sm:text-left
                    ">
                        <LineTimeBlock value={timeLeft.dias} label="D" />
                        <Divider />
                        <LineTimeBlock value={timeLeft.horas} label="H" />
                        <Divider />
                        <LineTimeBlock value={timeLeft.minutos} label="M" />
                        <Divider />
                        <LineTimeBlock value={timeLeft.segundos} label="S" isWarm />
                    </div>

                    {/* Footer */}
                    <div className="
                        flex flex-col sm:flex-row
                        items-center justify-between
                        gap-6 sm:gap-4
                        pt-6 sm:pt-8
                        border-t border-[var(--color-border-subtle)]
                    ">
                        <div className="flex gap-5 sm:gap-6">
                            {social.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                        text-[var(--color-text-tertiary)]
                                        hover:text-[var(--color-text-primary)]
                                        transition-colors
                                        text-sm sm:text-base
                                    "
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>

                        <span className="
                            text-[8px] sm:text-[9px]
                            font-bold uppercase tracking-widest
                            text-[var(--color-text-tertiary)]
                        ">
                            <Logo />
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Divider() {
    return (
        <span className="
            text-[var(--color-border-default)]
            font-thin
            text-lg sm:text-xl md:text-2xl
        ">
            /
        </span>
    );
}

function LineTimeBlock({
    value,
    label,
    isWarm,
}: {
    value: number;
    label: string;
    isWarm?: boolean;
}) {
    return (
        <div className="flex flex-col items-center sm:items-start">
            <span
                className={`
                    text-xl sm:text-2xl md:text-4xl
                    font-bold tabular-nums tracking-tight
                    ${isWarm ? "text-[var(--color-accent-warm)]" : "text-[var(--color-text-primary)]"}
                `}
            >
                {value.toString().padStart(2, "0")}
            </span>

            <span className="
                text-[8px] sm:text-[9px]
                font-black
                text-[var(--color-text-tertiary)]
                mt-1
            ">
                {label}
            </span>
        </div>
    );
}