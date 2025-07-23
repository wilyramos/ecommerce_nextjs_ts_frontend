import VentaCart from "@/components/POS/VentaCart";
import { searchProducts } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";
import { PiShoppingCartFill } from "react-icons/pi";

import ProductSearchForm from "@/components/POS/ProductSearchForm";

type SearchParams = Promise<{
    page?: string;
    limit?: string;
    query?: string;
}>;

export default async function POSpage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const {
        page = "1",
        limit = "5",
        query = "",
    } = params || {};

    const productos = await searchProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        query,
    });

    return (
        <div className="grid md:grid-cols-2 h-screen bg-white">
            {/* Productos */}
            <main className="p-4 overflow-y-auto">
                <ProductSearchForm />

                <section className="mt-4">
                    {productos && productos.products.length > 0 ? (
                        <ul className="rounded-xl divide-y divide-gray-200 ">
                            {productos.products.map((product) => (
                                <li key={product._id}>
                                    <ProductCardPOS product={product} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center justify-center py-12 text-gray-500 text-center">
                            <h2 className="text-lg font-semibold">No se encontraron productos</h2>
                        </div>
                    )}
                </section>
            </main>

            {/* Carrito */}
            <aside className="p-4 border-t md:border-t-0 md:border-l bg-white ">
                <h2 className="text-xl font-semibold mb-4 flex gap-2">
                    <PiShoppingCartFill size={24} />
                    Carrito de Compras
                </h2>
                <VentaCart />
            </aside>
        </div>
    );
}
