// app/page.tsx
import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import FeaturesList from "@/components/home/FeaturesList";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import HomepageSections from "@/components/home/sections/HomepageSections";
import HomepageSectionsWrapper from "@/components/home/sections/HomepageSectionsWrapper";
import BrandsList from "@/components/home/BrandsList";
import RecentViewed from "@/components/home/product/RecentViewed";

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
        <main className="flex flex-col gap-4 md:gap-8 pb-12">
            {/* 1. Hero / Promociones Principales con Features superpuesto */}
            <div className="relative">
                <section aria-label="Banners principales">
                    <CarruselPrincipal />
                </section>
                
                {/* 2. Barra de Confianza e Incentivos superpuesta */}
                <section aria-label="Beneficios de compra" className="relative z-10 -mt-6 md:-mt-8 px-4">
                    <FeaturesList />
                </section>
            </div>

            {/* 3. Navegación por Categorías Destacadas */}
            <section aria-label="Categorías principales">
                <CategoriasDestacadasWrapper />
            </section>
            
            {/* 4. Colecciones Destacadas Vía Backend */}
            <section aria-label="Colecciones de productos">
                <HomepageSections />
            </section>
            
            {/* 5. Escaparate Dinámico de Secciones Avanzadas */}
            <section aria-label="Secciones dinámicas">
                <HomepageSectionsWrapper />
            </section>

            {/* 6. Historial de Productos Vistos Recientemente */}
            <section aria-label="Historial de navegación" className="max-w-7xl mx-auto">
                <RecentViewed />
            </section>

            {/* 7. Marcas Oficiales */}
            <section aria-label="Marcas oficiales">
                <BrandsList />
            </section>
        </main>
    );
}