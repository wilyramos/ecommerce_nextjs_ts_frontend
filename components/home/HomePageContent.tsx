// components/home/HomePageContent.tsx

import CarruselPrincipal from "@/components/home/CarruselPrincipal";
import ProductosNuevos from "@/components/home/ProductosNuevos";
import ProductosDestacados from "@/components/home/ProductosDestacados";
import CategoriasDestacadasWrapper from "@/components/home/CategoriasDestacadasWrapper";

export default function HomePageContent() {
  return (
    <>
      <div className="container mx-auto py-5">
        <CarruselPrincipal />
      </div>

      <section className="container mx-auto bg-gray-300 rounded-3xl">
        <CategoriasDestacadasWrapper />
      </section>

      <section className="container mx-auto px-4">
        <ProductosNuevos />
      </section>

      <section className="container mx-auto px-4">
        <ProductosDestacados />
      </section>
    </>
  );
}
