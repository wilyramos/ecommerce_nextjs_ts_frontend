import { getProduct } from '@/src/services/products';
import React from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { Metadata } from 'next';
import { useCartStore } from "@/src/store/cartStore";
import AddProductToCart from '@/components/home/product/AddProductToCart';



type Params = Promise<{
    id: string;
}>; // This is a promise that resolves to an object with an id property

// 👉 SEO Dinámico
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {

    const { id } = await params;
    const producto = await getProduct(id);

    if (!producto) {
        return {
            title: 'Producto no encontrado | Mi Tienda Tech',
            description: 'El producto solicitado no existe.',
        };
    }

    return {
        title: `${producto.nombre} | Mi Tienda Tech`,
        description: producto.descripcion,
        openGraph: {
            title: `${producto.nombre} | Mi Tienda Tech`,
            description: producto.descripcion,
            url: `${process.env.NEXT_PUBLIC_URL}/productos/${producto._id}`,
            images: [
                {
                    url: producto.imagenes?.[0] || '/default-image.jpg',
                    width: 800,
                    height: 600,
                    alt: producto.nombre,
                },
            ],
        },
    };
}

export default async function pageProduct({ params }: { params: Params }) {

    const { id } = await params;
    const producto = await getProduct(id);

    
    

    if (!producto) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl text-gray-600">No hay producto</h1>
            </div>
        );
    }

    return (
        <main className="py-10">
            <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-4">
                {/* Imagen principal */}
                <div>
                    {producto.imagenes?.length > 0 ? (
                        <Image
                            src={producto.imagenes[0]}
                            alt={producto.nombre}
                            width={600}
                            height={450}
                            className="rounded-md object-cover w-full"
                        />
                    ) : (
                        <div className="bg-gray-100 aspect-[3/2] flex justify-center items-center rounded-md">
                            <span className="text-gray-400">Sin imagen</span>
                        </div>
                    )}

                    {/* Miniaturas */}
                    {producto.imagenes?.length > 1 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {producto.imagenes.slice(1).map((imagen, index) => (
                                <Image
                                    key={index}
                                    src={imagen}
                                    alt={`${producto.nombre} ${index + 2}`}
                                    width={150}
                                    height={100}
                                    className="rounded object-cover w-full hover:opacity-80 transition"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Detalles */}
                <div className="flex flex-col justify-between space-y-6">
                    <div>
                        <h1 className="text-3xl font-medium">{producto.nombre}</h1>
                        <p className="text-gray-500">Categoría: {producto.categoria?.nombre}</p>

                        <div className="mt-4 flex items-center gap-3 text-sm">
                            <span className="text-2xl text-indigo-600 font-semibold">{formatCurrency(producto.precio)}</span>
                            {producto.stock > 0 ? (
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Stock: {producto.stock}</span>
                            ) : (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Agotado</span>
                            )}
                            {producto.sku && (
                                <span className="text-gray-400">SKU: {producto.sku}</span>
                            )}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-medium mb-2">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed">{producto.descripcion}</p>
                        </div>
                    </div>

                    <AddProductToCart
                        product={producto}
                    />
                </div>
            </section>
        </main>
    );
}
