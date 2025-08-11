// File: frontend/app/(store)/page.tsx

import type { Metadata } from "next";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import ProductosNuevos from "@/components/home/ProductosNuevos";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";


export const metadata: Metadata = {
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
    "auriculares y audífonos Cañete",
    "repuestos y reparación de celulares",
    "ofertas de tecnología Cañete",
    "smartphones en Cañete",
    "tienda de tecnología en Cañete",
    "iphone",
    "audifonos",
    "case"
  ],
  authors: [{ name: "GoPhone Cañete", url: "https://gophone.pe" }],
  creator: "GoPhone",
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
  metadataBase: new URL("https://gophone.pe"),
  icons: {
    icon: "/logomini.svg",
    apple: "/logomini.svg",
  }
};

export default function HomePage() {
   return (
      <>
        <div className="container mx-auto">
          <CarruselPrincipal />
        </div>
  
        <section className="">
          <CategoriasDestacadasWrapper />
        </section>
  
        <section className="">
          <ProductosNuevos />
        </section>
  
        <section className="">
          <ProductosDestacados />
        </section>

      </>
    );
}