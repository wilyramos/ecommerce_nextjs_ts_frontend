import { GetProductsBySlug, getProductsRelated } from '@/src/services/products';
import { Metadata } from 'next';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import { Suspense } from 'react';
import ProductDetails from '@/components/home/product/ProductDetails';

type Params = Promise<{
  slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const producto = await GetProductsBySlug(slug);

    if (!producto) {
        return {
            title: 'Producto no encontrado | GoPhone',
            description: 'El producto que buscas no existe.',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://gophone.pe';

  const title = `${producto.nombre} | GoPhone`;
  const description =
    producto.descripcion?.slice(0, 160) ||
    'Compra accesorios y repuestos para celulares al mejor precio en GoPhone. Calidad y garantía aseguradas.';
  const imageUrl = producto.imagenes?.[0] || `${baseUrl}/logob.svg`;
  const canonicalUrl = `${baseUrl}/productos/${producto.slug}`;
  const productName = producto.nombre;

  return {
    title,
    description,
    applicationName: 'GoPhone',
    keywords: [
      productName,
      'repuestos para celulares',
      'accesorios para móviles',
      'fundas',
      'protectores',
      'GoPhone Perú',
    ],
    authors: [{ name: 'GoPhone', url: baseUrl }],
    creator: 'GoPhone',
    publisher: 'GoPhone',
    metadataBase: new URL(baseUrl),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'GoPhone',
        type: 'article',
        images: [
            {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: productName,
            },
        ],
    },
    
    alternates: {
      canonical: canonicalUrl,
    },
    category: producto.categoria || 'Accesorios',
  };
}

export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;


    // console.log('Cargando producto con slug:', slug);
    // Promise.all para obtener las consultas de manera concurrente

    const [producto, productsRelated] = await Promise.all([
        GetProductsBySlug(slug),
        getProductsRelated(slug),
    ]);

    // console.log('Producto:', producto);
    // console.log('Productos relacionados:', productsRelated);

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
