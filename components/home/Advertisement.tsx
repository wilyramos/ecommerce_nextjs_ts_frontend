"use client";

import { TbTruckDelivery } from "react-icons/tb";
import { FaRegCreditCard } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md"; // nuevo icono para envíos
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ads = [
    {
        id: 1,
        icon: <TbTruckDelivery />,
        text: (
            <>
                Envíos en <span className="font-semibold">Cañete</span>
                <span className="hidden sm:inline bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
                    GRATIS
                </span>
            </>
        ),
    },
    {
        id: 2,
        icon: <MdLocalShipping />,
        text: (
            <>
                Envíos a <span className="font-semibold">todo el Perú</span>
            </>
        ),
    },
    {
        id: 3,
        icon: <FaRegCreditCard />,
        text: (
            <>
                Paga con <span className="font-semibold">tarjeta o Yape</span>
            </>
        ),
    },
    // Extra opcional
    {
        id: 4,
        icon: <TbTruckDelivery />,
        text: (
            <>
                Recoge en <span className="font-semibold">tienda física</span> sin costo
            </>
        ),
    },
];

export default function Advertisement() {

    const [showBanner, setShowBanner] = useState(true);
    if (!showBanner) return null;

    return (
        <section className="relative bg-black text-white py-2 px-4 shadow-md">
            <button
                onClick={() => setShowBanner(false)}
                className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none"
            >
                <IoClose className="text-xl" aria-label="Cerrar anuncio" />
            </button>
            <Carousel
                additionalTransfrom={0}
                arrows={false}
                autoPlay
                autoPlaySpeed={3000}
                infinite
                keyBoardControl
                showDots={false}
                responsive={{
                    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
                    tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
                    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
                }}
            >
                {ads.map((ad) => (
                    <div
                        key={ad.id}
                        className="flex items-center justify-center gap-2 text-sm md:text-base font-medium"
                    >
                        {ad.icon}
                        <span>{ad.text}</span>
                    </div>
                ))}
            </Carousel>
        </section>
    );
}
