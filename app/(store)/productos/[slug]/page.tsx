import { GetProductsBySlug, getProductsRelated } from '@/src/services/products';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductJsonLd from '@/components/seo/ProductJsonLd';


type Params = Promise<{
    slug: string;
}>;


export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;

    // Promise.all para obtener las consultas de manera concurrente

    const [productsRelated, producto] = await Promise.all([
        getProductsRelated(slug),

        GetProductsBySlug(slug),
    ]);


    // console.log('Productos relacionados:', productsRelated);

    return (
        <main className='px-4'>
            {!producto ? (
                <div className="text-center py-10">
                    <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>

                </div>
            ) : (
                <>
                    {/* SEO */}

                    <ProductJsonLd producto={producto} />

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
                            <ProductosRelated productsRelated={productsRelated} />
                        </section>
                    )}
                </>
            )}
        </main>

    );
}
