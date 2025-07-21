import VentaCart from "@/components/POS/VentaCart";
import { searchProducts } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";
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

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const productos = await searchProducts({
        page: parsedPage,
        limit: parsedLimit,
        query: query || "",
    });

    return (
        <div className="flex flex-col md:flex-row h-screen md:h-[calc(100vh-32px)] bg-white">
            {/* Productos */}
            <main className="flex flex-1 flex-col order-1">
                <ProductSearchForm />
                <section className="flex-1 overflow-y-auto ">
                    {productos && productos.products.length > 0 ? (
                        <ul className="border rounded-2xl divide-y divide-gray-200 shadow-lg">
                            {productos.products.map((product) => (
                                <li key={product._id}>
                                    <ProductCardPOS product={product} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                            <h2 className="text-lg font-semibold">No se encontraron productos</h2>
                        </div>
                    )}
                </section>
            </main>

            {/* Carrito */}
            <aside className="w-full md:w-[360px] border-t md:border-t-0 md:border-l bg-white p-4 order-2">
                <h2 className="mb-4 text-lg text-gray-700 border-b font-extrabold">Resumen de venta</h2>
                <VentaCart />
            </aside>
        </div>
    );
}
