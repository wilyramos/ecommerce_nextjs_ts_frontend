// app/productos/[slug]/ProductPageServer.tsx
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import Breadcrumb from '@/components/home/products/Breadcrumbs';
import type { ProductWithCategoryResponse } from '@/src/schemas';

type Props = {
    producto: ProductWithCategoryResponse;
};


export default async function ProductPageServer({ producto }: Props) {

    if (!producto) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-gray-800">Producto no encontrado</h1>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-xl text-center hidden">
                {producto.nombre}
            </h1>

            <section className="max-w-7xl mx-auto py-2 ">
                <Breadcrumb
                    categoryName={producto.categoria?.nombre || 'General'}
                    categorySlug={producto.categoria?.slug || 'general'}
                    productName={producto.nombre}
                />

                <div className="flex flex-col lg:flex-row">
                    <div className="w-full">
                        <ProductDetails producto={producto} />
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto py-4 px-2">
                <ProductosRelated slug={producto.slug} />
            </section>
        </>
    );
}