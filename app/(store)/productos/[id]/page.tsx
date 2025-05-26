import { getProduct } from '@/src/services/products';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { Metadata } from 'next';
import AddProductToCart from '@/components/home/product/AddProductToCart';
import ImagenesProductoCarousel from '@/components/home/product/ImagenesProductoCarousel';


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
            <main className="py-10 bg-white">
                <section className="max-w-6xl mx-auto px-4">
                    <h1 className="text-xl font-semibold text-gray-900">Producto no encontrado</h1>
                    <p className="text-gray-600">El producto que buscas no existe.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="py-10 bg-white">
            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
                {/* Imágenes */}
                <ImagenesProductoCarousel images={producto.imagenes} />

                {/* Detalles */}
                <div className="flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-2xl font-semibold text-gray-900">{producto.nombre}</h1>

                        <div className="flex items-center flex-wrap gap-3 text-sm">
                            <span className="text-2xl font-bold text-indigo-600">
                                {formatCurrency(producto.precio)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${producto.stock > 0
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                                }`}>
                                {`${producto.stock > 0 ? `${producto.stock} En stock` : 'Sin stock'}`}
                            </span>
                            {producto.sku && (
                                <span className="text-gray-400 text-xs">SKU: {producto.sku}</span>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-medium mb-1">Descripción</h2>
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
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