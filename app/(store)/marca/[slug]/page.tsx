import { getProductsByBrandSlug } from '@/src/services/products';
import ProductosList from '@/components/home/product/ProductsList';


type Params = Promise<{
    slug: string;
}>;

// type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BrandsPage({ params }: { params: Params }) {

    console.log('Params:', params);

    const { slug } = await params;

    const products = await getProductsByBrandSlug(slug);

    if (!products || products.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No se encontraron productos.
            </div>
        );
    }
    return (
        <div className='p-6'>

            <h1 className="text-2xl font-bold mb-6 text-center">Productos de la Marca</h1>
            <ProductosList products={products} />
        </div>
    )
}