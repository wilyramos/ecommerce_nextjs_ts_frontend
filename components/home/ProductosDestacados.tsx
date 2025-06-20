import { getDestacadosProducts } from '@/src/services/products'
import ClientCarouselProductosNuevos from '@/components/home/ClientCarouselProductosNuevos'



export default async function ProductosDestacados() {


    const productsDestacados = await getDestacadosProducts()

    console.log("Productos Destacados:", productsDestacados)


    if (!productsDestacados || productsDestacados.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay productos destacados disponibles en este momento.
            </div>
        )
    }


    return (
        <section className="py-10">
            <div className="text-center mb-2">
                <h2 className="text-2xl font-extrabold tracking-tight mb-2">Productos Destacados</h2>
                <p className="text-gray-400 text-sm mt-2">Descubre nuestros productos más populares y recomendados</p>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <ClientCarouselProductosNuevos products={productsDestacados.products} />
                </div>
            </div>
        </section>
    )
}



