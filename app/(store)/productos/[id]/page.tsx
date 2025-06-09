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
            title: 'Producto no encontrado | GoPhone',
            description: 'El producto que buscas no existe.',
        };
    }

    return {
        title: `${producto.nombre} | GoPhone`,
        description: producto.descripcion,
        openGraph: {
            title: `${producto.nombre} | GoPhone`,
            description: producto.descripcion,
            url: `${process.env.NEXT_PUBLIC_URL}/productos/${producto._id}`,
            images: [
                {
                    url: producto.imagenes?.[0] || '/logob.svg',
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
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${producto.stock > 0
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-600'
                                    }`}
                            >
                                {`${producto.stock > 0 ? `${producto.stock} En stock` : 'Sin stock'}`}
                            </span>
                            {producto.sku && (
                                <span className="text-gray-400 text-xs">SKU: {producto.sku}</span>
                            )}
                            {producto.barcode && (
                                <span className="text-gray-400 text-xs">Código de barras: {producto.barcode}</span>
                            )}
                        </div>

                        {/* Información adicional */}
                        <div className="text-sm text-gray-700 space-y-1">
                            {producto.brand && (
                                <p>
                                    <span className="font-medium">Marca:</span> {producto.brand}
                                </p>
                            )}
                            {producto.color && (
                                <p>
                                    <span className="font-medium">Color:</span> {producto.color}
                                </p>
                            )}
                            {typeof producto.categoria === 'object' &&
                                'nombre' in producto.categoria && (
                                    <p>
                                        <span className="font-medium">Categoría:</span>{' '}
                                        {producto.categoria}
                                    </p>
                                )}
                        </div>

                        {/* Descripción */}
                        {producto.descripcion && (
                            <div>
                                <h2 className="text-lg font-medium mb-1">Descripción</h2>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                    {producto.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Variantes */}
                        {producto.variantes && producto.variantes.length > 0 && (
                            <div className="space-y-4 mt-4">
                                <h2 className="text-lg font-medium">Variantes disponibles</h2>
                                {producto.variantes.map((variante, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-3 text-sm space-y-2 bg-gray-50"
                                    >
                                        {variante.opciones.map((opcion, i) => (
                                            <div key={i}>
                                                <p className="font-medium">{opcion.nombre}:</p>
                                                <p>{opcion.valores.join(', ')}</p>
                                            </div>
                                        ))}
                                        <p className="text-gray-600">Stock: {variante.stock}</p>
                                        {variante.barcode && (
                                            <p className="text-gray-500 text-xs">
                                                Código de barras: {variante.barcode}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <AddProductToCart product={producto} />
                </div>
            </section>
        </main>
    );
}
