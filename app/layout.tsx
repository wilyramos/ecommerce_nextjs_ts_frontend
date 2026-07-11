// File: frontend/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MercadoPagoProvider from "@/components/provider/MercadoPagoProvider";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    // metadataBase permite usar rutas relativas en canónicas e imágenes en todo el proyecto
    metadataBase: new URL("https://gophone.pe"),
    title: {
        default: "GoPhone - Calidad a tu alcance",
        template: "%s | GoPhone" // Corregido espacio al final
    },
    description: "Accesorios y calidad a tu alcance. Envíos a todo el Perú. Compra iPhones, accesorios y repuestos con garantía y envío rápido. GoPhone: tecnología confiable desde Cañete para todo el Perú.",
    authors: [{ name: "GoPhone", url: "https://gophone.pe" }],
    creator: "GoPhone",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "GoPhone | Calidad a tu alcance",
        description: "Accesorios y calidad a tu alcance. Envíos a todo el Perú. Compra iPhones, accesorios y repuestos con garantía y envío rápido. GoPhone: tecnología confiable desde Cañete para todo el Perú.",
        url: "/",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "/images/og-main.jpg",
                width: 1200,
                height: 630,
                alt: "GoPhone - Calidad a tu alcance",
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone | Calidad a tu alcance",
        description: "Compra iPhones, accesorios y repuestos con garantía y envío rápido.",
        images: ["/images/og-main.jpg"]
    },
    category: "technology"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${inter.className} bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]`}>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <MercadoPagoProvider />
                    {children}
                    <Toaster
                        theme="dark"
                        expand
                        position="top-center"
                        duration={5000}
                        richColors={false}
                    />
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}