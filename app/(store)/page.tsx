import { Metadata } from "next";
import { metadata as globalMetadata } from "@/app/layout";
import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import FeaturesList from "@/components/home/FeaturesList";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";
import HomepageSections from "@/components/home/sections/HomepageSections";
import HomepageSectionsWrapper from "@/components/home/sections/HomepageSectionsWrapper";
import BrandsList from "@/components/home/BrandsList";
import RecentViewed from "@/components/home/product/RecentViewed";
import ScrollReveal from "@/components/ui/ScrollReveal";

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
    "cases",
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
  },
};


export default function HomePage() {
  return (
    <main className="flex flex-col gap-6 pb-16 md:gap-10 overflow-hidden">
      {/* 1. Hero Banner + Dock Flotante */}
      <ScrollReveal className="relative">
        <section aria-label="Banners promocionales">
          <CarruselPrincipal />
        </section>

        <section
          aria-label="Beneficios y garantías"
          className="relative z-10 -mt-5 px-3 sm:-mt-6 sm:px-6 md:-mt-8"
        >
          <FeaturesList />
        </section>
      </ScrollReveal>

      {/* 2. Categorías Principales */}
      <ScrollReveal delay={0.1}>
        <section aria-label="Categorías principales">
          <CategoriasDestacadasWrapper />
        </section>
      </ScrollReveal>

      {/* 3. Secciones Destacadas Backend */}
      <ScrollReveal delay={0.15}>
        <section aria-label="Colecciones de productos">
          <HomepageSections />
        </section>
      </ScrollReveal>

      {/* 4. Escaparates Dinámicos */}
      <ScrollReveal delay={0.15}>
        <section aria-label="Secciones dinámicas">
          <HomepageSectionsWrapper />
        </section>
      </ScrollReveal>

      {/* 5. Historial de Navegación */}
      <ScrollReveal delay={0.2}>
        <section
          aria-label="Historial de productos vistos"
          className="mx-auto w-full max-w-7xl px-4 md:px-6"
        >
          <RecentViewed />
        </section>
      </ScrollReveal>

      {/* 6. Marcas Oficiales */}
      <ScrollReveal delay={0.25}>
        <section aria-label="Marcas oficiales">
          <BrandsList />
        </section>
      </ScrollReveal>
    </main>
  );
}