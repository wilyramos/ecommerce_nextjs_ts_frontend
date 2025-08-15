import { getDestacadosProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos';

export default async function ProductosDestacados() {
  const destacados = await getDestacadosProducts();
  const productos = destacados?.products ?? [];

  if (!productos.length) {
    return (
      <p className="text-center py-6 text-gray-500 text-sm">
        No hay productos destacados por ahora.
      </p>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-4 bg-black/90 p-4">
        <header className="md:col-span-1 space-y-2 ">
          <h2 className="text-lg font-semibold text-white">
            Lo mejor de GoPhone
          </h2>
          <p className="text-sm text-gray-300">
            Nuestros productos más populares y recomendados.
          </p>
        </header>

        <div className="md:col-span-3">
          <ClientCarouselProductosNuevos products={productos} />
        </div>
      </div>
    </section>
  );
}
