import { getDestacadosProducts } from '@/src/services/products'
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos'



export default async function ProductosDestacados() {
    const productsDestacados = await getDestacadosProducts()

    if (!productsDestacados || productsDestacados.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 text-xs">
                No hay productos destacados disponibles en este momento.
            </div>
        )
    }


    return (
        <section className="py-10 bg-gradient-to-br from-blue-100 via-white to-cyan-100">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">Productos Destacados</h2>
                <p className="text-gray-600 text-sm mt-2">Descubre nuestros productos más populares y recomendados</p>
            </div>

            <div className="max-w-7xl mx-auto">
                <ClientCarouselProductosNuevos products={productsDestacados.products} />
            </div>
        </section>
    )
}



