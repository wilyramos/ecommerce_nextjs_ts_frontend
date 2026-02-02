// File: frontend/app/(store)/productos/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";

import ProductResults from "@/components/home/product/ProductResults";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export const metadata: Metadata = {
    metadataBase: new URL("https://gophone.pe"),

    title: {
        default: "Productos GoPhone | iPhone y Accesorios en Perú",
        template: "%s | GoPhone"
    },

    description:
        "Compra iPhones, accesorios originales, cargadores, audífonos, fundas, cables y repuestos. Tecnología garantizada con envío rápido a todo el Perú.",

    keywords: [
        "comprar iPhone Perú",
        "tienda Apple Perú",
        "accesorios iPhone originales",
        "cargadores iPhone originales",
        "AirPods Perú",
        "fundas iPhone",
        "repuestos iPhone Perú",
        "tienda tecnología online Perú",
        "gadgets tecnológicos Perú",
        "GoPhone Perú"
    ],

    applicationName: "GoPhone",
    authors: [{ name: "GoPhone", url: "https://gophone.pe" }],
    creator: "GoPhone",
    publisher: "GoPhone",

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
        }
    },

    openGraph: {
        title: "Productos GoPhone | iPhone y Accesorios",
        description:
            "Explora iPhones, accesorios Apple, cargadores, audífonos y más tecnología con garantía y envíos rápidos en Perú.",
        url: "https://gophone.pe/productos",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
        images: [
            {
                url: "https://gophone.pe/logobw.jpg",
                width: 1200,
                height: 630,
                alt: "Productos GoPhone Perú"
            }
        ]
    },

    twitter: {
        card: "summary_large_image",
        title: "Productos GoPhone | iPhone y Accesorios en Perú",
        description:
            "iPhones, accesorios y tecnología original con garantía. Compra online en GoPhone Perú.",
        images: ["https://gophone.pe/logobw.jpg"],
        creator: "@gophone"
    },

    alternates: {
        canonical: "https://gophone.pe/productos"
    },

    category: "technology",

    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
            { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" }
        ],
        apple: "/favicon.ico"
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

export default async function PageProducts({
    searchParams
}: {
    searchParams: SearchParams;
}) {
    const { category, priceRange, page, limit, sort, query, ...rest } =
        await searchParams;

    const limitNumber = limit ? parseInt(limit) : 24;

    return (
        <main className="md:max-w-screen-2xl mx-auto p-2 md:px-4 ">
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
