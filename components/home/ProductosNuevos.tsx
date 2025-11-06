import { getNewProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from './ClientCarouselProductosNuevos';

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts();

    if (!newProducts || newProducts.products.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">
                No hay productos nuevos disponibles en este momento.
            </div>
        );
    }

    return (
        <section className="">
            <div className="max-w-7xl mx-auto p-4 ">
                 <header className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-500">
                        <span className="bg-gray-200 px-2 text-gray-900">
                            Novedades
                        </span>

                        <p className="text-sm md:text-base text-gray-400">
                            Explora nuestras novedades y encuentra lo que necesitas.
                        </p>
                    </h2>
                    
                </header>
                <ClientCarouselProductosNuevos products={newProducts.products}  />
            </div>
        </section>
    );
}