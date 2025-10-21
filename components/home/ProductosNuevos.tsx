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
                <h2 className="text-xl font-medium tracking-tight text-gray-800 mb-6">
                    Productos Nuevos
                </h2>
                <ClientCarouselProductosNuevos products={newProducts.products}  />
            </div>
        </section>
    );
}