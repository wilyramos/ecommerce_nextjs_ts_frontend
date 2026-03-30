import VentaCart from "@/components/POS/VentaCart";
import { searchProducts } from "@/src/services/products";
import ProductCardPOS from "@/components/POS/ProductCardPOS";
import ProductSearchForm from "@/components/POS/ProductSearchForm";
import MobileCartSummary from "@/components/POS/MobileCartSummary";

type SearchParams = Promise<{ page?: string; limit?: string; query?: string }>;

export default async function POSpage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;
    const { page = "1", limit = "20", query = "" } = params || {}; // Límite alto para el grid

    const productos = query
        ? await searchProducts({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
        })
        : { products: [] };

    return (
        <div className="flex h-full w-full overflow-hidden bg-[var(--admin-bg)] relative">

            {/* =========================================
                PANEL IZQUIERDO: PRODUCTOS (Toma el espacio sobrante)
            ========================================= */}
            <section className="flex-1 flex flex-col h-full overflow-hidden">
                
                {/* Cabecera / Buscador Fijo */}
                <div className="shrink-0 bg-[var(--admin-surface)] p-4 border-b border-[var(--admin-border)] shadow-sm z-10">
                    <div className="max-w-3xl mx-auto w-full">
                        <ProductSearchForm />
                    </div>
                </div>

                {/* Grid de Productos Scrolleable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 pb-24 lg:pb-4">
                    <div className="max-w-6xl mx-auto w-full">
                        {productos?.products?.length ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                                {productos.products.map((p) => (
                                    <ProductCardPOS key={p._id} product={p} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-[var(--admin-text-muted)] space-y-4">
                                <svg className="w-20 h-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                                </svg>
                                <div className="text-center">
                                    <p className="text-lg font-semibold text-[var(--admin-text)]">¿Qué deseas vender hoy?</p>
                                    <p className="text-sm mt-1">Busca un producto por su nombre o código SKU.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* =========================================
                PANEL DERECHO: CARRITO (Fijo, solo Desktop)
            ========================================= */}
            <aside className="hidden lg:flex w-[400px] xl:w-[450px] shrink-0 flex-col h-full bg-[var(--admin-surface)] border-l border-[var(--admin-border)] shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20">
                <VentaCart />
            </aside>

            {/* =========================================
                BARRA MÓVIL: RESUMEN DE CARRITO (< lg)
            ========================================= */}
            <MobileCartSummary />

        </div>
    );
}