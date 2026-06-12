// File: frontend/app/(store)/layout.tsx

import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import { metadata as globalMetadata } from "@/app/layout";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import TopBarAdServer from "@/components/home/TopBarAdServer";

// Extendemos metadata global para esta sección
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "GoPhone | Calidad a tu alcance",
        template: "%s | GoPhone"
    },
    description:
        "Sección principal de la tienda GoPhone: productos, compras, cuenta y soporte.",
    openGraph: {
        ...globalMetadata.openGraph,
        title: "GoPhone",
        description:
            "Productos, compras, cuenta y soporte dentro de la tienda GoPhone.",
        url: "https://gophone.pe/productos",
        images: [
            {
                url: "https://gophone.pe/favicon.ico",
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
        images: ["https://gophone.pe/favicon.ico"]
    },
    alternates: {
        canonical: "https://gophone.pe/catalogo"
    }
};



export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <section className="flex flex-col min-h-screen">
                {/* Top bar sticky con hide-on-scroll — encima del navbar */}
                <TopBarAdServer />

                <header className="sticky top-0 z-40">
                    <NavBar />
                </header>

                <main className="flex-1">
                    {children}
                </main>

                <Footer />
            </section>

            {/* Modal global — se renderiza fuera del flow */}
            <GlobalAdContainer />
            <WhatsappButton />
        </>
    );
}