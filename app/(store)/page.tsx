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
  description: "GoPhone en Cañete para la compra de celulares, accesorios y más.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-8 pb-16 md:gap-12 overflow-x-hidden">
      
      {/* 1. Hero Banner - TÉCNICA BREAKOUT (Full Bleed Apple Style) */}
      {/* -mt-6 anula el py-6 del <main> para pegarse al navbar */}
      <ScrollReveal className="relative z-0 -mt-6 w-full">
        <section aria-label="Banners promocionales" className="w-full">
          <CarruselPrincipal />
        </section>
      </ScrollReveal>

      {/* 2. Dock Flotante (Garantías) */}
      {/* Lo subimos ligeramente para que monte sobre el banner, muy estilo Apple */}
      <ScrollReveal className="relative z-10 -mt-14 px-2 sm:px-4 md:-mt-16 mx-auto w-full max-w-7xl">
        <section aria-label="Beneficios y garantías">
          <FeaturesList />
        </section>
      </ScrollReveal>

      {/* 3. Categorías Principales */}
      <ScrollReveal delay={0.1} className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <section aria-label="Categorías principales">
          <CategoriasDestacadasWrapper />
        </section>
      </ScrollReveal>

      {/* 4. Colecciones */}
      <ScrollReveal delay={0.15}>
        <section aria-label="Colecciones de productos">
          <HomepageSections />
        </section>
      </ScrollReveal>

      {/* 5. Escaparates Dinámicos */}
      <ScrollReveal delay={0.15}>
        <section aria-label="Secciones dinámicas">
          <HomepageSectionsWrapper />
        </section>
      </ScrollReveal>

      {/* 6. Historial */}
      <ScrollReveal delay={0.2} className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <section aria-label="Historial de productos vistos">
          <RecentViewed />
        </section>
      </ScrollReveal>

      {/* 7. Marcas */}
      <ScrollReveal delay={0.25} className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <section aria-label="Marcas oficiales">
          <BrandsList />
        </section>
      </ScrollReveal>
    </main>
  );
}