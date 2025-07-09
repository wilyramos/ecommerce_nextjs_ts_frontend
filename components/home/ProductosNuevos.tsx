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
        <section className="py-12 bg-white">
    <div className="text-center mb-10 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Productos Nuevos
        </h2>
        <p className="text-base md:text-lg text-gray-500 mt-3">
            Explora las últimas novedades disponibles
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500 mx-auto mt-4 rounded-full" />
    </div>

    <div className="max-w-7xl mx-auto px-4">
        <ClientCarouselProductosNuevos products={newProducts?.products} />
    </div>
</section>
   
    )
}
