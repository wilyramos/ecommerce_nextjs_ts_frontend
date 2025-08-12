import { getNewProducts } from '@/src/services/products';
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos';

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
        <section className="py-4 bg-gradient-to-r from-slate-100 via-slate-100 to-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className=" mb-2">
                    <h2 className="text-xl font-bold text-black">
                        Productos Nuevos
                    </h2>
                    <div className="w-20 h-1 bg-indigo-600/70 mx-auto rounded-full" />
                </div>

                <ClientCarouselProductosNuevos products={newProducts.products} />
            </div>
        </section>
    );
}
