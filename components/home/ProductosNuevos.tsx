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
        <section className="mx-auto py-5 border-b  bg-white ">
            <div className=" mx-auto space-y-2">
                <ClientCarouselProductosNuevos products={newProducts.products} />
            </div>
        </section>
    );
}