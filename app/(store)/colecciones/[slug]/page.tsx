// File: frontend/app/(store)/colecciones/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getCatalogDataByCollection } from "@/src/services/catalog";
import CollectionLayout from "@/components/collections/CollectionLayout";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// ── Metadata dinámica ─────────────────────────────────────────────────────
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resolvedSP = await searchParams;
    const data = await getCatalogDataByCollection(slug, resolvedSP);

    if (!data) return { title: "Colección | GoPhone" };

    const { collectionName, collectionDesc, collectionImage,
        collectionSeoTitle, collectionSeoDesc, searchQuery } = data.context;

    const displayName = collectionName ?? "Colección";

    const title = searchQuery
        ? `Resultados para "${searchQuery}" en ${displayName}`
        : (collectionSeoTitle || displayName);

    const fullTitle = `${title} | GoPhone`;
    const description = collectionSeoDesc
        ?? collectionDesc
        ?? `Explora ${displayName} al mejor precio en Perú. Envíos a todo el país y garantía oficial.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gophone.pe";
    const canonical = `${baseUrl}/colecciones/${slug}`;

    return {
        title: fullTitle,
        description,
        alternates: { canonical },
        openGraph: {
            title: fullTitle,
            description,
            url: canonical,
            siteName: "GoPhone",
            images: collectionImage
                ? [{ url: collectionImage, width: 1200, height: 630, alt: title }]
                : [{ url: `${baseUrl}/images/og-catalog.jpg`, width: 1200, height: 630, alt: title }],
            locale: "es_PE",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
        },
        robots: {
            index: !data.isFallback && !searchQuery,
            follow: true,
        },
    };
}
// ── Page ──────────────────────────────────────────────────────────────────
export default async function CollectionPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSP = await searchParams;

    const data = await getCatalogDataByCollection(slug, resolvedSP);
    if (!data) return notFound();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://gophone.pe";
    const collectionName = data.context.collectionName ?? "Colección";

    // Schema estructurado
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: baseUrl },
            { "@type": "ListItem", position: 2, name: "Colecciones", item: `${baseUrl}/colecciones` },
            { "@type": "ListItem", position: 3, name: collectionName, item: `${baseUrl}/colecciones/${slug}` },
        ],
    };

    const collectionPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: collectionName,
        description: data.context.collectionDesc ?? undefined,
        url: `${baseUrl}/colecciones/${slug}`,
        numberOfItems: data.pagination.totalItems,
        mainEntity: {
            "@type": "ItemList",
            itemListElement: data.products.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${baseUrl}/producto/${p.slug}`,
                name: p.nombre,
            })),
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
            />
            <CollectionLayout
                products={data.products}
                filters={data.filters}
                pagination={data.pagination}
                context={data.context}
                isFallback={data.isFallback}
            />
        </>
    );
}