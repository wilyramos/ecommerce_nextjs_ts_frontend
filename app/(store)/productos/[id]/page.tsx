import { getProduct, getProductsRelated } from '@/src/services/products';
import { Metadata } from 'next';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import { Suspense } from 'react';
import ProductDetails from '@/components/home/product/ProductDetails';

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

    // Promise.all para obtener las consultas de manera concurrente

    const [producto, productsRelated] = await Promise.all([
        getProduct(id),
        getProductsRelated(id),
    ]);

    console.log('Producto:', producto);
    console.log('Productos relacionados:', productsRelated);

    return (
        <main className='px-4'>
            {!producto ? (
                <div className="text-center py-10">
                    <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>

                </div>
            ) : (
                <>
                    <div className=" mx-auto py-5">
                        <div className="flex flex-col lg:flex-row gap-10">                            
                            {/* Detalles del producto */}
                            <div className="w-full">
                                <ProductDetails producto={producto} />
                            </div>
                        </div>
                    </div>


                    {productsRelated && productsRelated.length > 0 && (
                        <section className="max-w-7xl mx-auto py-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos relacionados</h2>
                            <Suspense fallback={<div className="text-center py-4 text-gray-400 text-sm">Cargando productos relacionados...</div>}>
                                <ProductosRelated productId={producto._id} />
                            </Suspense>
                        </section>
                    )}
                </>

            )}
        </main>

    );
}
