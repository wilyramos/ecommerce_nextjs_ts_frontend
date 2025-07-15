// app/productos/[slug]/ProductPageServer.tsx
import { GetProductsBySlug } from '@/src/services/products';
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import Breadcrumb from '@/components/home/products/Breadcrumbs';
import ProductJsonLd from '@/components/seo/ProductJsonLd';

type Props = {
    slug: string;
};

export default async function ProductPageServer({ slug }: Props) {
    const [producto] = await Promise.all([
        GetProductsBySlug(slug),
    ]);

    if (!producto) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
            </div>
        );
    }

    return (
        <>
            <ProductJsonLd producto={producto} />

            <div className="max-w-7xl mx-auto py-2">
                <Breadcrumb
                    categoryName={producto.categoria?.nombre || 'General'}
                    categorySlug={producto.categoria?.slug || 'general'}
                    productName={producto.nombre}
                />

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="w-full">
                        <ProductDetails producto={producto} />
                    </div>
                </div>
            </div>

            <section className="max-w-7xl mx-auto py-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-t-2">Productos relacionados</h2>
                    <ProductosRelated slug={slug} />
            </section>
            
        </>
    );
}
