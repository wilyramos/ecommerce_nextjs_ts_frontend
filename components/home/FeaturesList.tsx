"use client";

import { FaTags } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";

const features = [
    { title: "Precios especiales", icon: FaTags },
    { title: "Envíos gratis", icon: TbTruckDelivery },
    { title: "Pago seguro", icon: RiSecurePaymentLine },
];

export default function MinimalFeatures() {
    return (
        <section className="bg-white py-10">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="flex flex-col items-center text-center text-gray-500 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                        <feature.icon size={28} />
                        <span className="text-xs font-medium mt-2">{feature.title}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
