import { getProduct, getProductsRelated } from '@/src/services/products';
import { formatCurrency } from '@/src/utils/formatCurrency';
import { Metadata } from 'next';
import AddProductToCart from '@/components/home/product/AddProductToCart';
import ImagenesProductoCarousel from '@/components/home/product/ImagenesProductoCarousel';
import ColorCircle from '@/components/ui/ColorCircle';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import { Suspense } from 'react';

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

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://gophone.pe'; // Reemplaza si tienes un dominio oficial

    const title = `${producto.nombre} | GoPhone`;
    const description = producto.descripcion?.slice(0, 160) || 'Encuentra los mejores accesorios y repuestos en GoPhone.';
    const imageUrl = producto.imagenes?.[0] || `${baseUrl}/logob.svg`;
    const productName = producto.nombre || 'Producto de GoPhone';

    return {
        title,
        description,
        keywords: [
            productName,
            producto.brand,
            producto.color,
            'repuestos', 'accesorios', 'celulares', 'GoPhone'
        ].filter(Boolean) as string[],
        authors: [{ name: 'GoPhone' }],
        openGraph: {
            title,
            description,
            url: `${baseUrl}/productos/${producto._id}`,
            siteName: 'GoPhone',
            locale: 'es_PE',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: `${productName} - GoPhone`,
                },
            ],
            type: 'article'


        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: `${baseUrl}/productos/${producto._id}`,
        },
    };
}


export default async function pageProduct({ params }: { params: Params }) {
    const { id } = await params;
    const producto = await getProduct(id);
    const productsRelated = await getProductsRelated(id);

    return (
        <main className="px-4 md:px-10">
            {!producto ? (
                <div className="max-w-6xl mx-auto py-10 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
                    <p className="mt-4 text-gray-600">Lo sentimos, el producto que buscas no existe o ha sido eliminado.</p>
                </div>
            ) : (
                <>
                    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
                        <ImagenesProductoCarousel images={producto.imagenes} />

                        <div className="flex flex-col justify-between space-y-2">
                            <div className="space-y-6">
                                <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>

                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-semibold text-indigo-600">
                                        {formatCurrency(producto.precio)}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                        ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                                    </span>
                                </div>

                                <ul className="text-sm text-gray-700 space-y-1">
                                    {producto.brand && <li><strong>Marca:</strong> {producto.brand}</li>}
                                    {producto.color && <li><strong>Color:</strong> {producto.color}</li>}
                                    {producto.sku && <li><strong>SKU:</strong> {producto.sku}</li>}
                                    {producto.barcode && <li><strong>Código:</strong> {producto.barcode}</li>}
                                </ul>

                                {producto.descripcion && (
                                    <div className="space-y-2">
                                        <h2 className="text-base font-medium text-gray-800">Descripción</h2>
                                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                                            {producto.descripcion}
                                        </p>
                                    </div>
                                )}

                                {producto.variantes?.length !== 0 && (
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <h2 className="font-medium text-gray-800">Variantes</h2>

                                        {producto.variantes?.map((v, i) => (
                                            <div key={i} className="border rounded-md p-2 bg-gray-50 text-xs text-gray-600 shadow-sm">
                                                <div className="space-y-1">
                                                    {v.opciones.map((o, j) => (
                                                        <div key={j} className="flex items-start gap-1">
                                                            <span className="font-medium text-gray-600">{o.nombre}:</span>
                                                            {o.nombre.toLowerCase() === 'color' ? (
                                                                <div className="flex gap-1">
                                                                    {o.valores.map((valor, k) => (
                                                                        <ColorCircle key={k} color={valor} />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500">{o.valores.join(', ')}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-[11px]">
                                                    <span className={`px-2 py-0.5 rounded-full font-medium ${v.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                        {v.stock > 0 ? `${v.stock} disponibles` : 'Sin stock'}
                                                    </span>
                                                    {v.barcode && <span className="text-gray-400">Código: {v.barcode}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <AddProductToCart product={producto} />
                        </div>
                    </section>

                    {productsRelated && productsRelated.length > 0 && (
                        <section className="max-w-6xl mx-auto py-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Productos relacionados</h2>
                            <Suspense fallback={<div className="text-center text-gray-500">Cargando productos relacionados...</div>}>
                                <ProductosRelated productId={producto._id} />
                            </Suspense>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}
