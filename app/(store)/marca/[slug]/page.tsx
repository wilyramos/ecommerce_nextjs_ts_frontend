// app/brands/[slug]/page.tsx
import { getProductsByBrandSlug } from '@/src/services/products';
import FiltersSidebar from '@/components/home/brand/FiltersSidebar';
import ProductosList from '@/components/home/product/ProductsList';
import { getAllSubcategories } from '@/src/services/categorys';
import { getBrandBySlug } from '@/src/services/brands';


type Params = Promise<{
    slug: string;
}>;

export default async function BrandsPage({ params }: { params: Params }) {
    const { slug } = await params;
    const [products, subcategories, brand] = await Promise.all([
        getProductsByBrandSlug(slug),
        getAllSubcategories(),
        getBrandBySlug(slug),
    ]);

    if (!brand) return <div className="p-6 text-center">Marca no encontrada</div>;

    return (
        <div className="flex flex-col md:flex-row gap-6 py-3">
            <aside className="md:w-64">
                <FiltersSidebar brand={brand} categorias={subcategories} />
            </aside>

            <main className="flex-1">
               

                {products?.products?.length ? (
                    <ProductosList products={products} />
                ) : (
                    <p className="text-center py-8 text-gray-500">No se encontraron productos.</p>
                )}
            </main>
        </div>
    );
}
