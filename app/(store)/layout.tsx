import Advertisement from "@/components/home/Advertisement";
import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa"; // Ícono oficial de WhatsApp


export const metadata : Metadata= {
    title: "GoPhone | Tecnologia y productos a tu alcance",
    description: "GoPhone es tu tienda de confianza para la compra de celulares, accesorios y más. Ofrecemos una amplia variedad de productos a los mejores precios.",
    keywords: [
        "GoPhone Cañete",
        "tienda iPhone Cañete",
        "venta de celulares Cañete",
        "accesorios para celulares",
        "tecnología en Cañete",
        "comprar iPhone Cañete",
        "gadgets Cañete",
        "tienda online Cañete",
        "GoPhone Perú",
        "cases y fundas Cañete",
        "cargadores y cables Cañete",
    ],
    authors: [{ name: "GoPhone Cañete", url: "https://gophone.pe" }],
    creator: "GoPhone",
    metadataBase: new URL("https://gophone.pe"),
    openGraph: {
        title: "GoPhone - Venta accesorios y tecnología en Cañete",
        description:
            "En GoPhone encontrarás una amplia variedad de accesorios y productos tecnológicos en Cañete. ¡Visítanos y descubre nuestras ofertas!",
        url: "https://gophone.pe",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone - Venta de accesorios y Tecnología en Cañete",
        description:
            "Compra iPhones, accesorios y más en GoPhone, tu tienda online de confianza en Cañete.",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    }
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
    )
}