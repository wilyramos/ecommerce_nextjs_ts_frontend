import { getNewProducts } from '@/src/services/products'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProductosNuevos() {
    const newProducts = await getNewProducts()

    return (
        <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Nuevos Productos</h2>
                <p className="text-gray-500 text-sm mt-2">Explora las últimas novedades disponibles</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {newProducts?.products.map(product => (
                    <Link
                        key={product._id}
                        href={`/productos/${product._id}`}
                        className="group border border-gray-200 rounded-md overflow-hidden hover:border-gray-400 transition"
                    >
                        <div className="relative w-full h-60 bg-gray-100">
                            {product.imagenes.length > 0 ? (
                                <Image
                                    src={product.imagenes[0]}
                                    alt={product.nombre}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                    Sin imagen
                                </div>
                            )}

                            {/* Etiqueta de precio */}
                            <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-semibold text-gray-800 rounded shadow">
                                S/. {product.precio}
                            </div>
                        </div>

                        {/* Nombre del producto */}
                        <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.nombre}</h3>
                        </div>
                    </Link>
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
