// ProductosDestacados.tsx
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
        <section className="max-w-7xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Texto arriba en mobile, derecha en desktop */}
                <header className="order-1 md:order-2 space-y-3 text-center md:text-left">
                    <h2 className="text-2xl  font-semibold text-black">
                        Lo mejor de{" "}
                        <span className="text-white bg-gray-950 px-2">
                            GoPhone
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-700">
                        Nuestros productos más populares y recomendados.
                    </p>
                </header>

                {/* Carrusel ocupa más espacio en desktop */}
                <div className="order-2 md:order-1 md:col-span-2">
                    <ClientCarouselProductosNuevos products={productos} />
                </div>
            </div>
        </section>
    );
}
