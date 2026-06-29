// File: frontend/app/(store)/catalogo/[[...slug]]/page.tsx
import { notFound } from "next/navigation";
import { getCatalogData } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug?: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const slugs = slug || [];

    const data = await getCatalogData(slugs, resolvedSearchParams);
    if (!data) return { title: "Catálogo" };

    const { categoryName, brandName, lineName, searchQuery } = data.context;

    // 1. Construcción Inteligente del Título (Limpio para que el template lo complete)
    let title = "Catálogo de Productos";

    if (searchQuery) {
        title = `Resultados para "${searchQuery}"`;
    } else {
        const parts = [];
        if (lineName) parts.push(lineName);
        if (brandName) parts.push(brandName);
        if (categoryName) parts.push(categoryName);

        if (parts.length > 0) {
            title = parts.join(" ");
        }
    }

    const description = `Compra ${title} al mejor precio en Perú. Envíos a todo el país y garantía oficial. Descubre ofertas en ${brandName || 'tecnología'} y más.`;

    // 2. URL Canónica Limpia (Sin parámetros de tracking o de filtrado)
    const canonicalPath = slugs.length > 0 ? `/catalogo/${slugs.join("/")}` : "/catalogo";

    // 3. Control estricto de Indexación frente a Query Parameters
    const queryKeys = Object.keys(resolvedSearchParams);
    const hasActiveFilters = queryKeys.some(key => 
        ["sort", "priceRange", "min", "max", "page", "atributos"].includes(key)
    );

    // No se indexan búsquedas internas, fallbacks o listados con filtros aplicados
    const shouldIndex = !data.isFallback && !searchQuery && !hasActiveFilters;

    return {
        title: title, // Next.js automáticamente renderizará: "Nombre del Catálogo | GoPhone"
        description: description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title: `${title} | GoPhone`,
            description: description,
            url: canonicalPath,
            siteName: "GoPhone",
            images: [
                {
                    url: "/images/og-main.jpg", // Resuelve de forma absoluta mediante la metadataBase global
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: "es_PE",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | GoPhone`,
            description: description,
        },
        robots: {
            index: shouldIndex,
            follow: true,
        },
    };
}

export default async function Page({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const slugs = slug || [];

    const data = await getCatalogData(slugs, resolvedSearchParams);
    if (!data) return notFound();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    // 1. Schema de Migas de Pan (Breadcrumbs)
    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Inicio", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "Catálogo", "item": `${baseUrl}/catalogo` },
        ]
    };

    // 2. Schema de Colección (CollectionPage)
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.context.searchQuery ? `Resultados para ${data.context.searchQuery}` : "Catálogo de Productos",
        "description": "Explora nuestra variada selección de tecnología.",
        "url": `${baseUrl}/catalogo/${slugs.join('/')}`,
        "numberOfItems": data.pagination.totalItems,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": data.products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${baseUrl}/productos/${product.slug}`,
                "name": product.nombre
            }))
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            <CatalogLayout
                products={data.products}
                filters={data.filters}
                pagination={data.pagination}
                context={data.context}
                isFallback={data.isFallback}
            />
        </>
    );
}