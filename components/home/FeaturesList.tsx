"use client";

import { FaTags } from "react-icons/fa";
import { MdOutlinePriceCheck } from "react-icons/md";
import { TbTruckDelivery, TbArrowBackUp } from "react-icons/tb";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";

const features = [
    { title: "Ofertas especiales", icon: FaTags },
    { title: "Precios cómodos", icon: MdOutlinePriceCheck },
    { title: "Envíos gratis", icon: TbTruckDelivery },
    { title: "Devoluciones gratis", icon: TbArrowBackUp },
    { title: "Soporte 24/7", icon: MdOutlineSupportAgent },
    { title: "Pago seguro", icon: RiSecurePaymentLine },
];

export default function MinimalFeatures() {
    return (
        <section className="bg-white py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="flex flex-col items-center text-center text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                        <feature.icon size={28} />
                        <span className="text-xs font-medium mt-2">{feature.title}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
