// ProductosDestacados.tsx
import { getDestacadosProducts } from '@/src/services/products';
import ProductCard from './product/ProductCard';


export default async function ProductosDestacados() {
    const destacados = await getDestacadosProducts();
    const productos = destacados?.products ?? [];

    if (!productos.length) {
        return null;
    }

    return (
        <section className="mx-auto py-5 px-4 bg-black">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center max-w-7xl mx-auto">
                {/* Texto arriba en mobile, derecha en desktop */}
                <header className="order-1 md:order-2 space-y-3 text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-gray-200">
                        Lo mejor de{" "}
                        <span className="text-white bg-gray-950 px-2">
                            GoPhone
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                        Nuestros productos más populares y recomendados.
                    </p>
                </header>

                {/* Carrusel ocupa más espacio en desktop */}
                <div className="order-2 md:order-2 md:col-span-4 grid grid-cols-2 md:grid-cols-5 grid-rows-2 gap-4">
                    {productos.slice(0, 10).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}