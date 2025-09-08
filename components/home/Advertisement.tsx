"use client";

import { TbTruckDelivery } from "react-icons/tb";
import { FaRegCreditCard } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md"; // nuevo icono para envíos
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ads = [
    {
        id: 1,
        icon: <TbTruckDelivery className="text-blue-800 text-lg" aria-hidden="true" />,
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
        icon: <MdLocalShipping className="text-blue-800 text-lg" aria-hidden="true" />,
        text: (
            <>
                Envíos a <span className="font-semibold">todo el Perú</span>
            </>
        ),
    },
    {
        id: 3,
        icon: <FaRegCreditCard className="text-blue-800 text-lg" aria-hidden="true" />,
        text: (
            <>
                Paga con <span className="font-semibold">tarjeta o Yape</span>
            </>
        ),
    },
    // Extra opcional
    {
        id: 4,
        icon: <TbTruckDelivery className="text-blue-800 text-lg" aria-hidden="true" />,
        text: (
            <>
                Recoge en <span className="font-semibold">tienda física</span> sin costo
            </>
        ),
    },
];

export default function Advertisement() {
    return (
        <section className="bg-yellow-300 text-blue-900 py-2 px-4 shadow-sm">
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
