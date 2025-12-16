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

    const ads = [
        {
            id: 1,
            icon: <Truck className="w-3 h-3 text-white" />,
            text: (
                <span className="flex items-center gap-2">
                    Envíos en <span className="font-bold text-white">Cañete</span>
                    <span className="bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                        Gratis
                    </span>
                </span>
            ),
        },
        {
            id: 2,
            text: (
                <span>
                    Envíos a <span className="font-bold text-white">todo el Perú</span>
                </span>
            ),
        },
        {
            id: 3,
            icon: <CreditCard className="w-3 h-3 text-white" />,
            text: (
                <span>
                    Paga con <span className="font-bold text-white">tarjeta o Yape</span>
                </span>
            ),
        },
        {
            id: 4,
            icon: <Store className="w-3 h-3 text-white" />,
            text: (
                <span>
                    Recoge en <span className="font-bold text-white">tienda física</span> sin costo
                </span>
            ),
        },
    ];

    if (!isVisible) return null;

    return (
        <div className="w-full relative overflow-hidden bg-black text-white h-7 py-1">

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
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition"
                >
                    <X size={16} />
                </button>

                <div
                    className={`flex items-center whitespace-nowrap w-max px-40 ${isHovered ? "paused" : ""
                        } animate-marquee`}
                >
                    {[...ads, ...ads, ...ads].map((ad, index) => (
                        <div key={`${ad.id}-${index}`} className="flex items-center mx-12 md:mx-20">
                            <div className="mr-2">{ad.icon}</div>
                            <div className="text-sm font-light">{ad.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
