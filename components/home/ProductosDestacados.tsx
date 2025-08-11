import { getDestacadosProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos';

export default async function ProductosDestacados() {
    const productsDestacados = await getDestacadosProducts();

    if (!productsDestacados || productsDestacados.products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No hay productos destacados disponibles en este momento.
            </div>
        );
    }

    return (
        <section className="py-12 bg-gradient-to-r">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-2">
                    <h2 className="text-lg font-bold text-black md:text-xl">
                        Lo mejor de GoPhone
                    </h2>
                    <p className="text-gray-500 text-sm md:text-base">
                        Descubre nuestros productos más populares y recomendados
                    </p>
                    <div className="w-20 h-1 bg-indigo-600/70 mt-4 mx-auto rounded-full" />
                </div>

                <ClientCarouselProductosNuevos products={productsDestacados.products} />
            </div>
        </section>
    );
}
