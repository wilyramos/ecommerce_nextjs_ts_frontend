import React from "react";
import Sidebarcs from "@/components/home/clientservice/Sidebarcs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Centro de Ayuda | Gophone",
    description:
        "Encuentra soporte, políticas de compra, garantías, devoluciones y ayuda en Gophone. Atención personalizada y respuestas rápidas a tus consultas.",
    keywords: [
        "Gophone",
        "centro de ayuda",
        "soporte",
        "garantías",
        "devoluciones",
        "preguntas frecuentes",
        "contacto",
        "proceso de compra",
        "tienda online Perú",
        "atención al cliente"
    ],
    openGraph: {
        title: "Centro de Ayuda | Gophone Perú",
        description:
            "Soporte y soluciones rápidas para tus compras en Gophone. Revisa garantías, devoluciones, políticas, contacto y más.",
        url: "https://gophone.pe/hc",
        siteName: "Gophone Perú",
        type: "website",
        images: [
            {
                url: "https://gophone.pe/og-image.jpg", // *Si no tienes imagen aún, puedo generarte una*
                width: 1200,
                height: 630,
                alt: "Centro de Ayuda Gophone Perú"
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    authors: [{ name: "Gophone Perú" }],
    creator: "Gophone Perú",
    publisher: "Gophone Perú",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">

            <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-6">
                <Sidebarcs />
                <main className="flex-1 md:pl-6">{children}</main>
            </div>

        </div>
    );
}
