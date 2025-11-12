//File: frontend/app/(store)/layout.tsx

import Advertisement from "@/components/home/Advertisement";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa"; // Ícono oficial de WhatsApp
import { metadata as globalMetadata } from "@/app/layout";
import type { Metadata } from "next";

// Extendemos metadata global para esta sección
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "Tienda | GoPhone Cañete",
        template: "%s | GoPhone Cañete",
    },
    description:
        "Explora nuestra tienda GoPhone: celulares, accesorios y tecnología al mejor precio en Cañete.",
};

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Aviso mejorado */}
                <Advertisement />

                <NavBar />
                <main className="min-h-screen px-1">{children}</main>
                <Footer />
            </div>

            <Link
                href="https://wa.me/51925054636?text=Hola%2C%20queria%20consultar%20sobre%20"
                target="_blank"
                rel="noopener noreferrer"
                className="
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-green-500/90 backdrop-blur-md
        shadow-[0_4px_12px_rgba(0,0,0,0.25)]
        hover:bg-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.8)]
        transition-all
        animate-bounce-slow
        group
    "
                aria-label="Chat en WhatsApp"
            >
                <FaWhatsapp className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            </Link>

        </>
    );
}
