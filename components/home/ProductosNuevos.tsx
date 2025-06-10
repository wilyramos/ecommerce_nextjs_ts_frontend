import { getNewProducts } from '@/src/services/products'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts()

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800">Nuevos Productos</h2>
                <p className="text-gray-500 mt-2">Explora lo más reciente que hemos agregado</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {newProducts?.products.map(product => (
                    <Link
                        href={`/productos/${product._id}`}
                        key={product._id}
                        className="relative bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 group"
                    >
                        <div className="relative w-full h-64">
                            {product.imagenes.length > 0 ? (
                                <Image
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-200">
                                    <span className="text-gray-500">Sin imagen</span>
                                </div>
                            )}

                            <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                                S/. {product.precio}
                            </div>

                            <div className="absolute bottom-0 w-full bg-black/50 text-white text-center text-sm font-semibold py-2 px-3 backdrop-blur-sm">
                                {product.nombre}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Link
                    href="/productos"
                    className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-500 transition"
                >
                    Ver todos los productos
                </Link>
            </div>
        </section>
    )
}
