import { getNewProducts } from '@/src/services/products'
import Link from 'next/link'
import ProductCard from '@/components/home/product/ProductCard'

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts()

    return (
        <section className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Nuevos Productos</h2>
                <p className="text-gray-500 text-sm mt-2">Explora las últimas novedades disponibles</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts?.products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            <div className="mt-14 text-center">
                <Link
                    href="/productos"
                    className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-800 transition"
                >
                    Ver todos los productos →
                </Link>
            </div>
        </section>
    )
}
