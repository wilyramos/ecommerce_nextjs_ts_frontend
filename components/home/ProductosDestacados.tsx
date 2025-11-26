import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="mx-auto py-5 px-4 border-b max-w-7xl">
            <div className=" mx-auto space-y-4">

                <h2 className="text-lg md:text-xl font-semibold tracking-tight text-gray-800">
                    Lo mejor de GoPhone
                </h2>

                <div
                    className="
                        grid
                        grid-cols-2
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-5
                        gap-2
                    "
                >
                    {productos.slice(0, 8).map((product) => (
                        <ProductCardHome key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
