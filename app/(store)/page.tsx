// File: frontend/app/(store)/page.tsx

import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import ProductosNuevos from "@/components/home/ProductosNuevos";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeaturesList from "@/components/home/FeaturesList";
import BrandsList from "@/components/home/BrandsList";
import Advertisement from "@/components/home/Advertisement";

// Metadata de la página principal de la tienda, extendiendo la global
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "GoPhone - Venta de accesorios y tecnologia premium",
        template: "%s | GoPhone",
    },
    description:
        "GoPhone es tu tienda de confianza en Cañete para la compra de celulares, accesorios y más. Ofrecemos productos de calidad, envío rápido y atención personalizada.",
    keywords: [
        "GoPhone",
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
        "iPhone",
        "audífonos",
        "cases"
    ],
    openGraph: {
        ...globalMetadata.openGraph,
        title: "GoPhone - Venta de accesorios y tecnología en Cañete",
        description:
            "En GoPhone encontrarás una amplia variedad de accesorios y productos tecnológicos en Cañete. ¡Visítanos y descubre nuestras ofertas!",
        url: "https://gophone.pe",
        images: [
            {
                url: "https://gophone.pe/logomini.svg",
                width: 1200,
                height: 630,
                alt: "GoPhone Home - Accesorios y Tecnología",
            },
        ],
    },
    twitter: {
        ...globalMetadata.twitter,
        title: "GoPhone - Venta de accesorios y tecnología en Cañete",
        description:
            "Compra iPhones, accesorios y más en GoPhone, tu tienda online de confianza en Cañete.",
        images: ["https://gophone.pe/logomini.svg"],
    }
};

export default function HomePage() {
    return (
        <>


            <section className="container mx-auto">
                <CarruselPrincipal />
            </section>

            <section className="max-w-7xl mx-auto">
                <Advertisement />
            </section>
           
            <section>
                <ProductosDestacados />
            </section>

            <section className="border-y max-w-7xl mx-auto">
                <ProductosNuevos />
            </section>

            <section className="my-5">
                <BrandsList />
            </section>

            <section>
                <FeaturesList />
            </section>

             <section className="my-10">
                <CategoriasDestacadasWrapper />
            </section>


        </>
    );
}
