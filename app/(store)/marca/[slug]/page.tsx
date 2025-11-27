// app/brands/[slug]/page.tsx
import { getBrandBySlug } from '@/src/services/brands';
import type { Metadata } from 'next';
import { metadata as globalMetadata } from '@/app/layout'; // mismo patrón que en /store

type Params = Promise<{
    slug: string;
}>;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// Generación dinámica de metadata para cada marca
export async function generateMetadata(
    { params }: { params: Promise<Params> }
): Promise<Metadata> {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);
    if (!brand) {
        return {
            title: 'Marca no encontrada | GoPhone',
            description: 'La marca solicitada no existe en GoPhone.',
        };
    }

    const title = `${brand.nombre} | GoPhone`;
    const description = `Productos de la marca ${brand.nombre} en GoPhone: variedad, soporte y las mejores ofertas.`;

    return {
        ...globalMetadata,
        title: {
            default: title,
            template: `%s | ${brand.nombre} | GoPhone`,
        },
        description,
        openGraph: {
            ...globalMetadata.openGraph,
            title,
            description,
            url: `https://gophone.pe/marca/${slug}`,
            images: [
                {
                    url: brand?.logo ?? 'https://gophone.pe/logobw.svg',
                    width: 1200,
                    height: 630,
                    alt: `Marca ${brand.nombre}`,
                },
            ],
        },
        twitter: {
            ...globalMetadata.twitter,
            title,
            description,
            images: [brand?.logo ?? 'https://gophone.pe/favicon.ico'],
        },
        alternates: {
            canonical: `https://gophone.pe/marca/${slug}`,
        },
    };
}

// ------- Page -------
import { getProductsByBrandSlug } from '@/src/services/products';
import FiltersSidebar from '@/components/home/brand/FiltersSidebar';
import ProductosList from '@/components/home/product/ProductsList';
import { getAllSubcategories } from '@/src/services/categorys';
import Pagination from '@/components/home/Pagination';

export default async function BrandsPage({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: SearchParams;
}) {
    const { slug } = await params;
    const allParams = await searchParams;
    const { limit = 10 } = allParams;

    const [data, subcategories, brand] = await Promise.all([
        getProductsByBrandSlug(slug),
        getAllSubcategories(),
        getBrandBySlug(slug),
    ]);

    if (!brand)
        return <div className="p-6 text-center">Marca no encontrada</div>;

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
                    <p className="text-center py-8 text-gray-500">
                        No se encontraron productos.
                    </p>
                )}
            </main>
        </div>
    );
}
