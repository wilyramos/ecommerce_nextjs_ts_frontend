// File: frontend/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import FavoritesSyncProvider from "@/components/provider/FavoritesSyncProvider";
import { getTokenOptional } from "@/src/auth/dal";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://gophone.pe"),
    title: {
        default: "GoPhone - Calidad a tu alcance",
        template: "%s | GoPhone"
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

// Convertimos el RootLayout en async para poder consultar la sesión
export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Verificamos si existe el token de sesión
    const token = await getTokenOptional();
    const isAuthenticated = !!token;

    return (
        <html lang="es" className="h-full scroll-smooth" suppressHydrationWarning>
            <body
                className={`${inter.className} min-h-full flex flex-col bg-surface-primary text-text-primary antialiased selection:bg-brand-primary selection:text-text-inverse`}
            >
                {/* Le pasamos el estado de autenticación al Provider */}
                <FavoritesSyncProvider isAuthenticated={isAuthenticated} />
                
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                    <div className="flex flex-1 flex-col">
                        {children}
                    </div>

                    <Toaster
                        position="top-center"
                        duration={4000}
                        toastOptions={{
                            classNames: {
                                toast: "bg-surface-primary text-text-primary border border-border-primary shadow-lg rounded-radius-lg font-sans",
                                description: "text-text-secondary text-sm",
                                actionButton: "bg-button-primary-bg text-button-primary-text hover:bg-button-primary-hover",
                                cancelButton: "bg-button-secondary-bg text-button-secondary-text hover:bg-button-secondary-hover",
                                error: "text-status-error",
                                success: "text-status-success",
                                warning: "text-status-warning",
                                info: "text-status-info",
                            },
                        }}
                    />
                </GoogleOAuthProvider>
                <Analytics />
            </body>
        </html>
    );
}