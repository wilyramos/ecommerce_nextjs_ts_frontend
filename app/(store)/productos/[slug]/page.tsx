import { GetProductsBySlug, getProductsRelated } from '@/src/services/products';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import Breadcrumb from '@/components/home/products/Breadcrumbs';

type Params = Promise<{
    slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {

    const { slug } = await params;
    const product = await GetProductsBySlug(slug);

    if (!product) {
        return {
            title: 'Producto no encontrado - GoPhone',
            description: 'El producto que buscas no está disponible.',
        };
    }

    const title = `${product.nombre} - GoPhone Cañete`;
    const description = product.descripcion?.replace(/\r?\n|\r/g, ' ').trim() || 'No description available';
    const categoryName = product.categoria?.nombre || 'General';
    const image = product.imagenes?.[0] || 'https://www.gophone.pe/default-product.jpg';

    return {
        title,
        description,
        keywords: [
            'GoPhone',
            'Cañete',
            'iPhone',
            'accesorios',
            'tecnología',
            "iphone Cañete",
            "san vicente de cañete",
            "imperial",
            "lunahuaná",
            
            categoryName,
        ],
        openGraph: {
            title,
            description,
            url: `https://www.gophone.pe/productos/${slug}`,
            siteName: 'GoPhone Cañete',
            type: 'product',
            images: [
                {
                    url: image,
                    alt: product.nombre,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    }
}

export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;

    const [productsRelated, producto] = await Promise.all([
        getProductsRelated(slug),
        GetProductsBySlug(slug),
    ]);


    return (
        <main className="px-4">
            {!producto ? (
                <div className="text-center py-10">
                    <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
                </div>
            ) : (
                <>
                    {/* SEO */}
                    <ProductJsonLd producto={producto} />

                    <div className="max-w-7xl mx-auto py-2">
                        {/* ✅ Breadcrumb aquí */}
                        <Breadcrumb
                            categoryName={producto.categoria?.nombre || 'General'}
                            categorySlug={producto.categoria?.slug || 'general'}
                            productName={producto.nombre}
                        />

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
