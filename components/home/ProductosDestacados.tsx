import { getDestacadosProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos';
import { FiStar } from 'react-icons/fi';

export default async function ProductosDestacados() {
    const productsDestacados = await getDestacadosProducts();

    if (!productsDestacados || productsDestacados.products.length === 0) {
        return (
            <p className="text-center py-8 text-gray-500 text-sm">
                No hay productos destacados disponibles en este momento.
            </p>
        );
    }

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 grid gap-8 grid-cols-1 md:grid-cols-4 bg-slate-200 p-3 rounded-2xl">
                
                {/* Texto introductorio */}
                <header className="md:col-span-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <FiStar className="w-6 h-6 flex-shrink-0" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Lo mejor de GoPhone
                        </h2>
                    </div>
                    <p className="mt-2 text-gray-600">
                        Descubre nuestros productos más populares y recomendados a precios únicos.
                    </p>
                </header>

                {/* Carrusel */}
                <div className="flex flex-col md:col-span-3">
                    <div className="w-16 h-1 bg-indigo-600 rounded-full mb-4 md:mb-6" />
                    <ClientCarouselProductosNuevos products={productsDestacados.products} />
                </div>
            </div>
        </section>
    );
}
