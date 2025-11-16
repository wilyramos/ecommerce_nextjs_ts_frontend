//File: frontend/app/%28store%29/productos/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import ProductResults from "@/components/home/product/ProductResults";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export const metadata: Metadata = {
    metadataBase: new URL("https://gophone.pe"),
    title: "CatáloGo de Productos",
    description:
        "Catálogo completo de productos GoPhone: iPhones, accesorios, cargadores, audífonos, fundas, cables, repuestos y más tecnología disponible con envío rápido en Perú.",
    keywords: [
        "GoPhone productos",
        "iPhone Perú",
        "accesorios iPhone",
        "tienda tecnología Perú",
        "cargadores originales",
        "audífonos y AirPods",
        "fundas y protectores",
        "repuestos iPhone",
        "smartphones Perú",
        "gadgets tecnológicos",
        "cables y adaptadores",
        "tienda online de tecnología"
    ],
    authors: [{ name: "GoPhone" }],
    creator: "GoPhone",
    openGraph: {
        title: "Productos GoPhone | Tecnología y Accesorios",
        description:
            "Explora todos los productos disponibles: iPhones, accesorios, cargadores, fundas y más tecnología de calidad con garantía y envíos rápidos.",
        url: "https://gophone.pe/productos",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://gophone.pe/logob.svg",
                width: 1200,
                height: 630,
                alt: "Productos GoPhone Perú"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Productos GoPhone | Tecnología y Accesorios",
        description:
            "Encuentra iPhones, accesorios, cargadores, cables, audífonos y más tecnología con garantía en GoPhone Perú.",
        images: ["https://gophone.pe/logomini.svg"]
    },
    alternates: {
        canonical: "https://gophone.pe/productos"
    },
    icons: {
        icon: "/logoapp.png",
        apple: "/logoapp.png"
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
        <main className="md:max-w-screen-2xl mx-auto px-2 md:p-5">

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