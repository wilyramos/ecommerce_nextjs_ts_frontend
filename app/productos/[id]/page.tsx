import { getProduct } from '@/src/services/products';
import Image from 'next/image';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { Metadata } from 'next';
import AddProductToCart from '@/components/home/product/AddProductToCart';

type Params = Promise<{ id: string }>;

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
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <h1 className="text-2xl text-gray-500">Producto no encontrado</h1>
            </div>
        );
    }

    return (
        <main className="py-10 bg-white">
            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
                {/* Imagen */}
                <div>
                    {producto.imagenes?.length > 0 ? (
                        <Image
                            src={producto.imagenes[0]}
                            alt={producto.nombre}
                            width={800}
                            height={600}
                            className="rounded-xl object-cover w-full h-auto shadow-md"
                            priority
                        />
                    ) : (
                        <div className="bg-gray-100 aspect-video flex items-center justify-center rounded-xl shadow-inner">
                            <span className="text-gray-400 text-sm">Sin imagen</span>
                        </div>
                    )}

                    {/* Miniaturas */}
                    {producto.imagenes?.length > 1 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {producto.imagenes.slice(1).map((img, i) => (
                                <Image
                                    key={i}
                                    src={img}
                                    alt={`${producto.nombre} ${i + 2}`}
                                    width={120}
                                    height={90}
                                    className="rounded-lg object-cover w-full h-[80px] sm:h-[90px] hover:opacity-80 transition"
                                    priority={i < 2}
                                    quality={100}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Detalles */}
                <div className="flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-semibold text-gray-900">{producto.nombre}</h1>


                        <div className="flex items-center gap-4 flex-wrap text-sm">
                            <span className="text-2xl text-indigo-600 font-bold">
                                {formatCurrency(producto.precio)}
                            </span>
                            {producto.stock > 0 ? (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                    Stock: {producto.stock}
                                </span>
                            ) : (
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">
                                    Agotado
                                </span>
                            )}
                            {producto.sku && (
                                <span className="text-gray-400 text-xs">SKU: {producto.sku}</span>
                            )}
                        </div>

                        <div className="mt-6">
                            <h2 className="text-lg font-medium mb-2">Descripción</h2>
                            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                                {producto.descripcion}
                            </p>
                        </div>
                    </div>

                        <AddProductToCart product={producto} />
                </div>
            </section>
        </main>
    );
}
