// File: frontend/app/(store)/hc/layout.tsx

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
                url: "https://gophone.pe/og-image.jpg",
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
        <main className="min-h-screen bg-background text-foreground">
            <div className="flex w-full max-w-screen-2xl mx-auto px-4 md:px-8 pt-8 pb-24 md:pb-8 gap-0 md:gap-8">
                <Sidebarcs />
                <section className="flex-1 min-w-0">
                    {children}
                </section>
            </div>
        </main>
    );
}