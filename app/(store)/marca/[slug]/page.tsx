// app/brands/[slug]/page.tsx
import { getProductsByBrandSlug } from '@/src/services/products';
import FiltersSidebar from '@/components/home/brand/FiltersSidebar';
import ProductosList from '@/components/home/product/ProductsList';
import { getAllSubcategories } from '@/src/services/categorys';
import { getBrandBySlug } from '@/src/services/brands';
import Pagination from '@/components/home/Pagination';


type Params = Promise<{
    slug: string;
}>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;


export default async function BrandsPage({ params, searchParams }: { params: Params, searchParams: SearchParams }) {
    const { slug } = await params;

    const allParams = await searchParams;

    const { limit = 10 } = allParams;

    const [data, subcategories, brand] = await Promise.all([
        getProductsByBrandSlug(slug),
        getAllSubcategories(),
        getBrandBySlug(slug),
    ]);
    

    if (!brand) return <div className="p-6 text-center">Marca no encontrada</div>;

    return (
        <div className="flex flex-col md:flex-row gap-6 py-3 max-w-7xl mx-auto px-5">
            <aside className="md:w-64">
                <FiltersSidebar brand={brand} categorias={subcategories} />
            </aside>

            <main className="flex-1">
               
                {data?.products?.length ? (
                    <>
                        <ProductosList products={data.products} />
                        <Pagination
                            currentPage={data.currentPage}
                            totalPages={data.totalPages}
                            pathname={`/marca/${slug}`}
                            queryParams={{}}
                            limit={limit ? parseInt(limit.toString()) : 10}
                        />
                    </>

                ) : (
                    <p className="text-center py-8 text-gray-500">No se encontraron productos.</p>
                )}

            </main>
        </div>
    );
}
