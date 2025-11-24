import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="mx-auto py-5 px-4 border-b max-w-7xl">
            <div className=" mx-auto space-y-5 ">

                <h2 className="text-3xl md:text-4xl font-medium mb-2 tracking-tight">
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
                        gap-4
                    "
                >
                    {productos.slice(0, 10).map((product) => (
                        <ProductCardHome key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
