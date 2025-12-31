import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="mx-auto p-4 md:p-8 border-b max-w-7xl">
            <div className=" mx-auto space-y-2">

                <h2 className="text-lg md:text-xl font-semibold tracking-tighter text-gray-800">
                    Lo mejor de GoPhone
                </h2>
                <div className='border-2 border-b border-blue-900 mb-2 w-20 md:w-32'>

                </div>

                <div
                    className="
                        grid
                        grid-cols-2
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-4
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
