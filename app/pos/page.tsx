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
        limit = "10",
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
        <div className="flex h-[calc(100vh-32px)] gap-4">
            {/* Productos */}
            <main className="flex flex-1 flex-col">

                <ProductSearchForm />

                <section className="flex-1 overflow-y-auto pr-2">
                    {productos && productos.products.length > 0 ? (
                        <ul className="space-y-4">
                            {productos.products.map((product) => (
                                <li key={product._id}>
                                    <ProductCardPOS product={product} />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                            <h2 className="text-lg font-semibold">No se encontraron productos</h2>
                            {/* <ButtonResetSearch /> */}
                        </div>
                    )}
                </section>
            </main>

            {/* Carrito */}
            <aside className="w-[360px] border-l bg-white p-4 overflow-y-auto">
                <h2 className="mb-4 text-lg text-gray-700 border-b">Resumen de venta</h2>
                <VentaCart />
            </aside>
        </div>
    );
}
