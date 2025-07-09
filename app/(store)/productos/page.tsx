import type { Metadata } from "next";
import { Suspense } from "react";
import ProductResults from "@/components/home/product/ProductResults";
import CategoriasFiltros from "@/components/home/product/CategoriasFiltros";
import OrdenarPor from "@/components/home/products/OrdenarPor";
import { CiFilter } from "react-icons/ci";
// import SpinnerLoading from "@/components/ui/SpinnerLoading";

export const metadata: Metadata = {
    title: "Productos - GoPhone Cañete | iPhones, Accesorios y Tecnología",
    description:
        "Explora nuestra amplia selección de productos en GoPhone Cañete. Encuentra iPhones, accesorios para celulares, audífonos, cargadores y más tecnología de calidad.",
    keywords: [
        "productos GoPhone",
        "iPhone Cañete",
        "comprar accesorios celulares",
        "gadgets en Cañete",
        "tecnología móvil",
        "audífonos, cargadores, fundas",
        "accesorios iPhone Perú",
        "tienda online tecnología Cañete",
        "airpods y audífonos Cañete",
        "cargadores y cables Cañete",
        "fundas y cases iPhone Cañete",
        "repuestos celulares Cañete",
    ],
    authors: [{ name: "GoPhone" }],
    creator: "GoPhone",
    openGraph: {
        title: "Productos - GoPhone Cañete",
        description:
            "Encuentra productos tecnológicos como iPhones, accesorios, cargadores y más en GoPhone, tu tienda de confianza en Cañete.",
        url: "https://gophone.pe/productos",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone Cañete - Productos y Accesorios Tecnológicos",
        description:
            "Revisa nuestra selección de productos tecnológicos disponibles en GoPhone Cañete. ¡Envíos rápidos y precios increíbles!",
    },
    metadataBase: new URL("https://gophone.pe"),
};

type SearchParams = Promise<{
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: string;
    sort?: string;
    query?: string;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {
    const { category, priceRange, page, limit, sort, query } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 12;

    return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Filtros móviles colapsables */}
                <div className="sm:hidden mb-6">
                    <details className="bg-white rounded-xl shadow p-4 border border-gray-200">
                        <summary className="flex items-center gap-2 text-gray-700 font-semibold cursor-pointer">
                            <CiFilter className="text-xl" />
                            <span>Mostrar filtros</span>
                        </summary>
                        <div className="mt-4">
            <Suspense fallback={<p className="text-center">Cargando...</p>}>
                                <CategoriasFiltros />
                            </Suspense>
                        </div>
                    </details>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                    {/* Sidebar filtros desktop */}
                    <aside className="hidden sm:block sm:col-span-1">
                        <div className="sticky top-24 bg-white p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros</h2>
            <Suspense fallback={<p className="text-center">Cargando...</p>}>
                                <CategoriasFiltros />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Productos y orden */}
                    <section className="sm:col-span-4 flex flex-col gap-6">
                        <div className="flex justify-end">
                            <OrdenarPor pathname="/productos" />
                        </div>

            <Suspense fallback={<p className="text-center">Cargando...</p>}>
                            <ProductResults
                                category={category}
                                priceRange={priceRange}
                                page={page}
                                limit={limitNumber}
                                sort={sort}
                                query={query}
                                
                            />
                        </Suspense>
                    </section>
                </div>
            </main>
    );
}