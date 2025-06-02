import type { Metadata } from "next";
import { Suspense } from "react";
import ProductResults from "@/components/home/product/ProductResults";
import CategoriasFiltros from "@/components/home/product/CategoriasFiltros";
import OrdenarPor from "@/components/home/products/OrdenarPor";

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
    brand?: string;
    color?: string;
    sort?: string;
    compatibilidad?: string;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {
    const { category, priceRange, page, limit, brand, color, sort, compatibilidad } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 12;

    return (
        <main className="max-w-7xl mx-auto p-5">
            <section className="grid grid-cols-1 sm:grid-cols-4 gap-6">

                {/* Filtros */}
                <div className="sm:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Filtros</h2>
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando filtros...</div>}>
                        <CategoriasFiltros />
                    </Suspense>
                </div>

                {/* Productos */}
                <section className="sm:col-span-3">
                    <OrdenarPor
                        pathname="/productos"
                    />
                    <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Cargando productos...</div>}>
                        <ProductResults
                            category={category}
                            priceRange={priceRange}
                            page={page}
                            limit={limitNumber}
                            brand={brand}
                            color={color}
                            sort={sort}
                            compatibilidad={compatibilidad}
                        />
                    </Suspense>
                </section>

            </section>
        </main>

    );
}