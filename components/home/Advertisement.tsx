"use client";

import { useState } from "react";
import { Truck, CreditCard, Store, X, ChevronRight, MapPin } from "lucide-react";

export default function AppleStyleAd() {
    const [isVisible, setIsVisible] = useState(true);

    const ads = [
        {
            id: 1,
            icon: <Truck size={13} />,
            content: (
                <>
                    Envíos en <span className="text-white font-medium">Cañete</span> •
                    <span className="ml-1 text-[#0071e3] font-medium hover:underline cursor-pointer">Gratis</span>
                </>
            ),
        },
        {
            id: 2,
            icon: <MapPin size={13} />,
            content: (
                <>
                    Envíos a todo el Perú vía <span className="text-white font-medium">Shalom</span>
                </>
            ),
        },
        {
            id: 3,
            icon: <CreditCard size={13} />,
            content: (
                <>
                    Pagos seguros con <span className="text-white font-medium">Tarjeta o Yape</span>
                </>
            ),
        },
        {
            id: 4,
            icon: <Store size={13} />,
            content: (
                <span className="group flex items-center gap-0.5 cursor-pointer">
                    Recojo presencial <span className="text-white font-medium ml-1"></span>
                    <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
            ),
        },
    ];

    if (!isVisible) return null;

    return (
        <div className="w-full bg-[#1d1d1f]/90 backdrop-blur-md sticky top-0  border-b border-white/5">
            <style>{`
        @keyframes marquee-refined {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-refined {
          animation: marquee-refined 40s linear infinite;
        }
        .animate-marquee-refined:hover {
          animation-play-state: paused;
        }
      `}</style>

            <div className=" mx-auto relative h-10 flex items-center overflow-hidden">
                {/* Apple-style Gradient Fades */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#1d1d1f] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1d1d1f] to-transparent z-10 pointer-events-none" />

                {/* Marquee Container */}
                <div className="flex items-center whitespace-nowrap animate-marquee-refined">
                    {[...ads, ...ads, ...ads].map((ad, index) => (
                        <div
                            key={`${ad.id}-${index}`}
                            className="flex items-center mx-12 text-[12px] text-[#f5f5f7] opacity-80 hover:opacity-100 transition-opacity tracking-tight font-light"
                        >
                            {ad.icon && <span className="mr-2 text-[#86868b]">{ad.icon}</span>}
                            <div>{ad.content}</div>
                        </div>
                    ))}
                </div>

                {/* Modern Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 p-1.5 rounded-full hover:bg-white/10 text-[#86868b] hover:text-white transition-all z-20"
                    aria-label="Cerrar"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}