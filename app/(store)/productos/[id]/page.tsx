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
            <main className="px-10">
                <section className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">Producto no encontrado</h1>
                    <p className="text-gray-500">El producto que buscas no existe.</p>
                </section>
            </main>
        );
    }

    return (
        <main className="px-10">
            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
                <ImagenesProductoCarousel images={producto.imagenes} />

                <div className="flex flex-col justify-between">
                    <div className="space-y-5">
                        <h1 className="text-4xl font-extrabold text-gray-900">{producto.nombre}</h1>

                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-indigo-600">
                                {formatCurrency(producto.precio)}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                            {producto.brand && <p><strong>Marca:</strong> {producto.brand}</p>}
                            {producto.color && <p><strong>Color:</strong> {producto.color}</p>}
                            {producto.sku && <p><strong>SKU:</strong> {producto.sku}</p>}
                            {producto.barcode && <p><strong>Código:</strong> {producto.barcode}</p>}

                            {/* {
                                typeof producto.categoria === 'object' && producto.categoria?.nombre ? (
                                    <p><strong>Categoría:</strong> {producto.categoria.nombre}</p>
                                ) : (
                                    <p><strong>Categoría:</strong> Sin categoría</p>
                                )
                            } */}
                        </div>

                        {producto.descripcion && (
                            <div>
                                <h2 className="text-lg font-medium text-gray-800">Descripción</h2>
                                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{producto.descripcion}</p>
                            </div>
                        )}

                        {producto.variantes && producto.variantes?.length > 0 && (
                            <div className="space-y-3 flex-cols">
                                <h2 className="text-lg font-medium text-gray-800">Variantes</h2>
                                {producto.variantes.map((v, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg border p-3 text-sm">
                                        {v.opciones.map((o, j) => (
                                            <p key={j}><strong>{o.nombre}:</strong> {o.valores.join(', ')}</p>
                                        ))}
                                        <p className="text-gray-600">Stock: {v.stock}</p>
                                        {v.barcode && <p className="text-gray-500 text-xs">Código: {v.barcode}</p>}
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>

                    <AddProductToCart
                        product={producto} 
                        // className="mt-5 md:mt-0 md:w-auto md:self-start"
                    
                    />
                </div>
            </section>
        </main>
    );
}