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
                <main className="min-h-screen">{children}</main>
                <Footer />
            </div>

            <Link
                href="https://wa.me/51907103353?text=Hola%2C%20queria%20consultar%20sobre%20"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-12 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all"
                aria-label="Chat en WhatsApp"
            >
                <FaWhatsapp className="w-6 h-6" />
            </Link>
        </>
    );
}
