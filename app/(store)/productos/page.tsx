import type { Metadata } from "next";
import { Suspense } from "react";
import ProductResults from "@/components/home/product/ProductResults";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export const metadata: Metadata = {
    title: "Productos - GoPhone | Accesorios y Tecnología",
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
        "smartphones en Cañete",
        "tienda de tecnología en Cañete"
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
    icons: {
        icon: "/logomini.svg",
        apple: "/logomini.svg",
    }
};

type SearchParams = Promise<{
    category?: string;
    priceRange?: string;
    page?: string;
    limit?: string;
    sort?: string;
    query?: string;
    [key: string]: string | string[] | undefined;
}>;

export default async function PageProducts({ searchParams }: { searchParams: SearchParams }) {
    const { category, priceRange, page, limit, sort, query, ...rest } = await searchParams;
    const limitNumber = limit ? parseInt(limit) : 24;

    return (
        <main className=" max-w-7xl mx-auto p-4">

            <Suspense fallback={<SpinnerLoading />}>
                <ProductResults
                    category={category}
                    priceRange={priceRange}
                    page={page}
                    limit={limitNumber}
                    sort={sort}
                    query={query}
                    {...rest}
                />
            </Suspense>

        </main>
    );
}