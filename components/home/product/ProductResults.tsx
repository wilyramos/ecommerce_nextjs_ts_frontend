import { getProductsMainPage } from "@/src/services/products";
import ProductosList from "./ProductsList";
import Pagination from "../Pagination";
import ProductsFiltersMain from "./ProductsFiltersMain";
import OrdenarPor from "../products/OrdenarPor";
import DrawerFiltersMain from "./DrawerFiltersMain";
import ActiveFiltersChips from "../products/ActiveFiltersChips";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

type ProductResultsProps = {
    category?: string;
    priceRange?: string;
    page?: string;
    sort?: string;
    query?: string;
} & Record<string, string | string[] | undefined | number>;

export default async function ProductResults({
    category,
    priceRange,
    page,
    sort,
    query,
    ...rest
}: ProductResultsProps) {
    const currentPage = page ? parseInt(page, 10) : 1;

    const products = await getProductsMainPage({
        page: currentPage,
        category: category || "",
        priceRange: priceRange || "",
        query: query || "",
        sort: sort || "",
        ...rest,
    });

    if (!products) {
        return (
            <div className="py-24 text-center text-[var(--store-text-muted)] font-medium">
                Error al cargar productos
            </div>
        );
    }

    const isFallback = products.totalProducts === 0;
    const hasProducts = products.products.length > 0;

    // Formateo de categoría: cable-de-carga -> Categoría Cable de carga
    const formatLabel = (text: string) => {
        const clean = text.replace(/-/g, ' ');
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    };

    const displayTitle = query
        ? `Resultados para "${query}"`
        : category
            ? `Categoría ${formatLabel(category)}`
            : "Todos los productos";


    return (
        <main className="flex flex-col gap-2 animate-in fade-in duration-500">
            <div className="pt-1 opacity-70 hover:opacity-100 transition-opacity">
                <Breadcrumbs
                    items={[
                        { label: "Catálogo", href: "/productos" },
                        ...(category ? [{ label: formatLabel(category), href: `/categoria/${category}` }] : []),
                    ]}
                />
            </div>

            {!isFallback && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 ">

                    {/* SIDEBAR + HEADER (desktop) */}
                    <aside className="hidden md:block md:col-span-1 p-2">
                        <div className="flex flex-col gap-3 pb-2">
                            <header className="flex flex-col gap-1">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--store-text)] leading-tight">
                                    {displayTitle}
                                </h1>

                                <span className="text-[13px] font-semibold text-[var(--store-text-muted)] uppercase tracking-widest opacity-60">
                                    {products.totalProducts} Productos
                                </span>

                                <div className="min-h-[28px] mt-2">
                                    <ActiveFiltersChips />
                                </div>
                            </header>
                        </div>

                        <div className="sticky top-24 ">
                            <ProductsFiltersMain filters={products.filters || null} />
                        </div>
                    </aside>

                    {/* CONTENIDO PRINCIPAL */}
                    <section className="col-span-1 md:col-span-4 flex flex-col p-2">

                        {/* Header MOBILE */}
                        <div className="md:hidden px-1 mb-4">
                            <header className="flex flex-col gap-1">
                                <h1 className="text-2xl font-bold tracking-tight text-[var(--store-text)] leading-tight">
                                    {displayTitle}
                                </h1>

                                <span className="text-[11px] font-bold text-[var(--store-text-muted)] uppercase tracking-widest opacity-60">
                                    {products.totalProducts} Productos encontrados
                                </span>

                                <div className="min-h-[28px] mt-1">
                                    <ActiveFiltersChips />
                                </div>
                            </header>
                        </div>

                        {/* Barra superior */}
                        <div
                            className="
                            flex justify-between md:justify-end items-center
                            gap-2 text-[13px] font-semibold border-b md:border-none
                            sticky md:static top-12
                            py-2 md:py-1
                            bg-[var(--store-surface)] md:bg-transparent
                            z-10
                        "
                        >
                            <div className="md:hidden">
                                <DrawerFiltersMain filters={products?.filters || null} />
                            </div>

                            <div className="flex items-center gap-2 text-[var(--store-text)]">
                                <span className="hidden md:block opacity-50 font-medium">Ordenar por:</span>
                                <OrdenarPor pathname="/productos" />
                            </div>
                        </div>

                        {hasProducts && (
                            <div className="flex flex-col gap-5">
                                <ProductosList products={products.products} />

                                <div className="pt-8 border-t border-[var(--store-border)]">
                                    <Pagination
                                        currentPage={products.currentPage}
                                        totalPages={products.totalPages}
                                        limit={24}
                                        pathname="/productos"
                                        queryParams={{
                                            category,
                                            priceRange,
                                            sort,
                                            query,
                                            ...rest,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}

            {isFallback && (
                <section className="flex flex-col gap-12 pt-10 items-center">
                    <div className="text-center py-12 max-w-md">
                        <h2 className="text-2xl font-bold text-[var(--store-text)] tracking-tight mb-2">
                            No hay resultados
                        </h2>
                        <p className="text-[var(--store-text-muted)] text-sm leading-relaxed">
                            No encontramos productos que coincidan con tu búsqueda.
                            Prueba ajustando los filtros.
                        </p>
                    </div>

                    {hasProducts && (
                        <div className="w-full border-t border-[var(--store-border)] pt-10">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-8 text-center">
                                Recomendados para ti
                            </h3>
                            <ProductosList products={products.products} />
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}