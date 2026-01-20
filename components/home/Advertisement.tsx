"use client";

import { useState } from "react";
import { Truck, CreditCard, Store, X, ChevronRight } from "lucide-react";

const useHover = () => {
    const [isHovered, setIsHovered] = useState(false);
    return {
        isHovered,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
    };
};

export default function Advertisement() {
    const [isVisible, setIsVisible] = useState(true);
    const { isHovered, onMouseEnter, onMouseLeave } = useHover();

    const ads = [
        {
            id: 1,
            icon: <Truck size={14} strokeWidth={1.5} />,
            text: (
                <span className="flex items-center gap-1.5">
                    Envíos en <span className="font-semibold">Cañete</span>
                    <span className="bg-[var(--store-primary)] font-bold p-1 rounded-full text-[var(--store-surface)]">
                        Gratis
                    </span>
                </span>
            ),
        },
        {
            id: 2,
            text: (
                <span>
                    Envíos a <span className="font-semibold">todo el Perú</span> vía <span className="font-semibold text-white bg-red-600 px-1.5 py-0.5 ">SHALOM</span>
                </span>
            ),
        },
        {
            id: 3,
            icon: <CreditCard size={14} strokeWidth={1.5} />,
            text: (
                <span>
                    Paga con <span className="font-semibold">tarjeta o Yape</span> de forma segura
                </span>
            ),
        },
        {
            id: 4,
            icon: <Store size={14} strokeWidth={1.5} />,
            text: (
                <span className="flex items-center gap-1">
                    Recojo en <span className="font-semibold">tienda física</span> <ChevronRight size={10} />
                </span>
            ),
        },
    ];

    if (!isVisible) return null;

    return (
        <div className="w-full relative overflow-hidden bg-[var(--store-text)] text-[var(--store-surface)] h-9 flex items-center transition-all ">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 60s linear infinite; }
                .paused { animation-play-state: paused; }
            `}</style>

            <div
                className="relative flex items-center w-full h-full overflow-hidden"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Lateral Blurs style Apple */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--store-text)] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--store-text)] to-transparent z-10 pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1 text-[var(--store-text-muted)] hover:text-white transition-colors"
                    aria-label="Cerrar anuncio"
                >
                    <X size={14} />
                </button>

                <div
                    className={`flex items-center whitespace-nowrap w-max px-20 ${isHovered ? "paused" : ""
                        } animate-marquee`}
                >
                    {[...ads, ...ads, ...ads].map((ad, index) => (
                        <div
                            key={`${ad.id}-${index}`}
                            className="flex items-center mx-10 md:mx-16 text-[11px] md:text-xs font-normal tracking-tight"
                        >
                            {ad.icon && <div className="mr-2 text-[var(--store-text-muted)]">{ad.icon}</div>}
                            <div className="hover:opacity-100 transition-opacity cursor-default">
                                {ad.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}