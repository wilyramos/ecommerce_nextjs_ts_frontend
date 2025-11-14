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
                        <span className=" px-2 text-gray-900">
                            Novedades
                        </span>

                        <p className="border-b-2 border-gray-700 w-24 mx-auto md:mx-0 mt-2 mb-4">
                        </p>
                    </h2>
                    
                </header>
                <ClientCarouselProductosNuevos products={newProducts.products}  />
            </div>
        </section>
    );
}