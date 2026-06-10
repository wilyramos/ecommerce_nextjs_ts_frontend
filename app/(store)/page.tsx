import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import FeaturesList from "@/components/home/FeaturesList";
import BrandsList from "@/components/home/BrandsList";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import HomepageSectionsWrapper from "@/components/home/sections/HomepageSectionsWrapper";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import HomepageSections from "@/components/home/sections/HomepageSections";

// Metadata for SEO and social sharing
export const metadata: Metadata = {
    ...globalMetadata,
    title: {
        default: "GoPhone - Calidad a tu alcance",
        template: "%s | GoPhone",
    },
    description:
        "GoPhone en Cañete para la compra de celulares, accesorios y más. Ofrecemos productos de calidad, envío rápido y atención personalizada.",
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
        title: "GoPhone - Calidad a tu alcance",
        description:
            "En GoPhone encontrarás una amplia variedad de accesorios y productos tecnológicos en Cañete. ¡Visítanos y descubre nuestras ofertas!",
        url: "https://gophone.pe",
        images: [
            {
                url: "https://gophone.pe/favicon.ico",
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
        images: ["https://gophone.pe/favicon.ico"],
    }
};

export default function HomePage() {
    return (
        <>
            <GlobalAdContainer />

            <section>
                <CarruselPrincipal />
            </section>


            <HomepageSections />

            <section className="my-2 md:my-10">
                <CategoriasDestacadasWrapper />
            </section>

            <HomepageSectionsWrapper />


            <section className="my-2 md:my-5">
                <BrandsList />
            </section>

            <section className="">
                <FeaturesList />
            </section>
        </>
    );
}