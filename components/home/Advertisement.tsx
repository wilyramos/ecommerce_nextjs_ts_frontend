"use client";
import { useState } from "react";
import { Truck, CreditCard, Store, X } from "lucide-react";

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

    // Clases comunes para el texto blanco sobre fondo oscuro
    const textBase = "text-[var(--store-surface)]";
    const textBold = "font-bold text-white"; // Blanco puro para resaltar

    const ads = [
        {
            id: 1,
            icon: <Truck className={`w-3 h-3 ${textBase}`} />,
            text: (
                <span className="flex items-center gap-2">
                    Envíos en <span className={textBold}>Cañete</span>
                    <span className="bg-[var(--store-danger)] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                        Gratis
                    </span>
                </span>
            ),
        },
        {
            id: 2,
            text: (
                <span>
                    Envíos a <span className={textBold}>todo el Perú</span>
                </span>
            ),
        },
        {
            id: 3,
            icon: <CreditCard className={`w-3 h-3 ${textBase}`} />,
            text: (
                <span>
                    Paga con <span className={textBold}>tarjeta o Yape</span>
                </span>
            ),
        },
        {
            id: 4,
            icon: <Store className={`w-3 h-3 ${textBase}`} />,
            text: (
                <span>
                    Recoge en <span className={textBold}>tienda física</span> sin costo
                </span>
            ),
        },
    ];

    if (!isVisible) return null;

    return (
        /* Fondo oscuro usando la variable de texto principal (#1D1D1F) 
           para contraste con el navbar blanco 
        */
        <div className="w-full relative overflow-hidden bg-[var(--store-text)] text-[var(--store-surface)] h-7 py-1 transition-colors">

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee { animation: marquee 80s linear infinite; }
                .paused { animation-play-state: paused; }
            `}</style>

            <div
                className="relative flex items-center h-6 overflow-hidden"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {/* Degradados laterales ajustados al color de fondo --store-text */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--store-text)] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--store-text)] to-transparent z-10 pointer-events-none"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 text-[var(--store-text-muted)] hover:text-white hover:bg-white/10 rounded-full transition"
                >
                    <X size={16} />
                </button>

                <div
                    className={`flex items-center whitespace-nowrap w-max px-40 ${isHovered ? "paused" : ""
                        } animate-marquee`}
                >
                    {[...ads, ...ads, ...ads].map((ad, index) => (
                        <div key={`${ad.id}-${index}`} className="flex items-center mx-12 md:mx-20 text-xs md:text-sm font-light tracking-wide">
                            {ad.icon && <div className="mr-2">{ad.icon}</div>}
                            <div>{ad.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}