import VentaCart from "@/components/POS/VentaCart";
import { searchProducts } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";
import ProductSearchForm from "@/components/POS/ProductSearchForm";

type SearchParams = Promise<{ page?: string; limit?: string; query?: string }>;

export default async function POSpage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const { page = "1", limit = "9", query = "" } = params || {};

    const productos = query
        ? await searchProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
        })
        : { products: [] };

    return (
        <div className="grid md:grid-cols-[1.2fr_0.8fr] h-full w-full gap-2 relative bg-white">

            {/* COLUMNA IZQUIERDA */}
            <main className="flex flex-col h-full overflow-hidden">

                {/* Buscador */}
                <div className="p-2 border-b border-gray-200 bg-gray-50 z-10 shrink-0">
                    <ProductSearchForm />
                </div>

                {/* Resultados con scroll */}
                <section className="flex-1 overflow-y-auto p-2 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-20 md:pb-0">
                        {productos?.products?.length ? (
                            productos.products.map((p) => (
                                <ProductCardPOS key={p._id} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-400">
                                <span className="text-sm">No se encontraron productos</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* COLUMNA DERECHA - CARRITO POS */}
            <aside
                className="
                /* Escritorio */
                md:static md:h-full 

                /* Móvil (deslizable) */
                fixed bottom-0 inset-x-0 z-30
                h-auto max-h-[55vh] overflow-y-auto
                bg-gray-50 border-t border-gray-300 shadow-[0_-4px_8px_-1px_rgba(0,0,0,0.10)]
            "
            >
                <div className="h-dvh  p-3">
                    <VentaCart />
                </div>
            </aside>
        </div>
    );
}
