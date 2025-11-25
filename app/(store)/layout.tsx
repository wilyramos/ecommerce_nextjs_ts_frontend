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
        default: "GoPhone | Tienda",
        template: "%s | GoPhone"
    },
    description:
        "Sección principal de la tienda GoPhone: productos, compras, cuenta y soporte.",
    openGraph: {
        ...globalMetadata.openGraph,
        title: "GoPhone | Tienda",
        description:
            "Productos, compras, cuenta y soporte dentro de la tienda GoPhone.",
        url: "https://gophone.pe/store",
        images: [
            {
                url: "https://gophone.pe/logob.svg",
                width: 1200,
                height: 630,
                alt: "GoPhone Tienda"
            }
        ]
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "GoPhone | Tienda",
        description:
            "Explora productos, compras y soporte en la tienda GoPhone.",
        images: ["https://gophone.pe/logoapp.svg"]
    },
    alternates: {
        canonical: "https://gophone.pe/store"
    }
};


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col min-h-screen">
                {/* Aviso mejorado */}
                <header id="global-header" className="w-full sticky top-0 z-[10000]">
                    <Advertisement />
                    <NavBar />
                </header>
                <main className="min-h-screen">{children}</main>
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
