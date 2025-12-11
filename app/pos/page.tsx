import VentaCart from "@/components/POS/VentaCart";
import { searchProducts } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";
import ProductSearchForm from "@/components/POS/ProductSearchForm";

type SearchParams = Promise<{ page?: string; limit?: string; query?: string }>;

export default async function POSpage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const { page = "1", limit = "12", query = "" } = params || {};

    const productos = query
        ? await searchProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
        })
        : { products: [] };

    return (
        <div className="flex h-full flex-col md:flex-row">

            {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
            <section className="flex flex-1 flex-col overflow-hidden">
                
                {/* Buscador */}
                <div className="shrink-0 border-b bg-gray-50 p-2">
                    <ProductSearchForm />
                </div>

                {/* Lista de Productos Scrollable */}
                <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
                    {/* pb-[42vh] en móvil es CRUCIAL: 
                       Crea espacio al final para que el carrito (fixed bottom) 
                       no tape los últimos productos.
                    */}
                    <div className="grid grid-cols-2 gap-2 pb-[42vh] sm:grid-cols-3 md:grid-cols-3 md:pb-4 lg:grid-cols-4 xl:grid-cols-5">
                        {productos?.products?.length ? (
                            productos.products.map((p) => (
                                <ProductCardPOS key={p._id} product={p} />
                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center text-gray-400">
                                No se encontraron productos
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* SECCIÓN DERECHA: CARRITO */}
            <aside className="
                /* MÓVIL: Panel fijo abajo (40% altura) */
                fixed bottom-0 left-0 right-0 z-20 h-[40vh] w-full border-t bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]
                
                /* DESKTOP: Columna lateral (Ancho fijo, Altura completa) */
                md:static md:h-full md:w-[380px] md:border-l md:shadow-none lg:w-[420px]
            ">
                <div className="h-full w-full overflow-hidden p-2">
                    <VentaCart />
                </div>
            </aside>
            
        </div>
    );
}