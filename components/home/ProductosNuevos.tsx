import { getNewProducts } from '@/src/services/products'
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos'

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts()

    if (!newProducts || newProducts.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay productos nuevos disponibles en este momento.
            </div>
        )
    }


    return (
        <section className="">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">Productos Nuevos</h2>
                <p className="text-gray-400 text-sm mt-2">Explora las últimas novedades disponibles</p>
            </div>

            <div className="max-w-7xl mx-auto">
                <ClientCarouselProductosNuevos products={newProducts?.products} />
            </div>
        </section>
    )
}
