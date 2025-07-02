import type { Metadata } from "next";
import "./globals.css";
import { Fustat } from "next/font/google";
import { Toaster } from 'sonner';


const fustat = Fustat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GoPhone Cañete | iPhones, Accesorios y Tecnología",
    template: "%s | GoPhone Cañete",
  },
  description:
    "En GoPhone Cañete encuentras iPhones, fundas, accesorios y tecnología original al mejor precio. Compra en línea con garantía, envío rápido y atención personalizada.",
  keywords: [
    "GoPhone",
    "GoPhone Cañete",
    "iPhones en Cañete",
    "comprar iPhone Perú",
    "accesorios para iPhone",
    "fundas de celular",
    "repuestos iPhone Perú",
    "tecnología en Cañete",
    "tienda de celulares",
    "tienda online Cañete",
    "envío rápido iPhone",
    "compras seguras",
    "productos Apple",
    "repuestos originales iPhone",
    "GoPhone tienda online",
    "smartphones en Cañete",
    "San Vicente de Cañete tecnología",
    "mejor tienda de iPhones en Perú",
  ],
  authors: [{ name: "GoPhone Cañete", url: "https://gophone.pe" }],
  creator: "GoPhone Cañete",
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
        url: "https://gophone.pe/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GoPhone Cañete - Venta de iPhones y Tecnología",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GoPhone Cañete | iPhones y Tecnología en Perú",
    description:
      "Compra iPhones y accesorios con envío rápido y atención personalizada. GoPhone, tu tienda de confianza en Cañete.",
    images: ["https://gophone.pe/og-image.jpg"],
  },
  icons: {
    icon: "/logoapp.svg",
    apple: "/apple-touch-icon.png",
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
        className={`${fustat.className}`}
      >
        {/* <NavBar /> */}
        {children}
        <Toaster
          // position="left-button"
          richColors
          toastOptions={{
            className: "bg-gray-800 text-white",
          }}
          expand
          duration={5000}
        />
      </body>
    </html>
  );
}
