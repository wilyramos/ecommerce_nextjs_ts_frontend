import { getDestacadosProducts } from '@/src/services/products';
import ProductCardHome from './product/ProductCardHome';

export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) return null;

    return (
        <section className="mx-auto py-8 px-4">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Texto superior */}
                <header className="text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-500">
                        Lo mejor de{" "}
                        <span className="text-white bg-gray-950 px-2">
                            GoPhone
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Nuestros productos más populares y recomendados.
                    </p>
                </header>

                {/* Grilla de productos responsive */}
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
                    {productos.slice(0, 10).map((product) => (
                        <ProductCardHome key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
