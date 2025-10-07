//File: frontend/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Assistant } from "next/font/google";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";

const assistant = Assistant({
    subsets: ["latin"],
    weight: ["500", "700"],
});

export const metadata: Metadata = {
    title: {
        default: "GoPhone Cañete | Accesorios y Tecnología",
        template: "%s | GoPhone Cañete",
    },
    description: "Tu tienda de confianza en Cañete: iPhones, accesorios y tecnología.",
    keywords: ["GoPhone", "Cañete", "iPhones", "Accesorios", "Tecnología", "Repuestos", "Tienda Online", "Electrónica", "Gadgets", "Smartphones", "Tablets", "Laptops", "Ofertas", "Promociones", "Envío Rápido", "Garantía", "Calidad", "Servicio al Cliente", "Cañete", "San Vicente", "Imperial", "Mala", "Asia", "Lunahuana"
    ],
    authors: [{ name: "GoPhone Cañete", url: "https://gophone.pe" }],
    creator: "GoPhone",
    metadataBase: new URL("https://gophone.pe"),
    openGraph: {
        title: "GoPhone Cañete | Tu Tienda de iPhones y Tecnología en Perú",
        description:
            "Descubre la mejor tienda online de Cañete: iPhones, accesorios, repuestos y más. Compra fácil, recibe rápido y con garantía de confianza.",
        url: "https://gophone.pe",
        siteName: "GoPhone Cañete",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://gophone.pe/logob.svg",
                width: 1200,
                height: 630,
                alt: "GoPhone Cañete - Accesorios y Tecnología",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone Cañete | iPhones y Tecnología en Perú",
        description:
            "Compra iPhones y accesorios con envío rápido y atención personalizada. GoPhone, tu tienda de confianza en Cañete.",
        images: ["https://www.gophone.pe/logomini.svg"],
    },
    icons: {
        icon: "/logoapp.svg",
        apple: "/favicon.ico",
        shortcut: "/favicon.ico",
    },
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <html lang="es">
            <body
                className={`${assistant.className} bg-gray-50`}
            >
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <MercadoPagoProvider />
                    {children}
                    <Toaster
                        richColors
                        toastOptions={{
                            className: "bg-gray-800 text-white",
                        }}
                        expand
                        duration={5000}
                    />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}