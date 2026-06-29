// File: frontend/app/(store)/productos/[slug]/page.tsx
import { GetProductsBySlug } from '@/src/services/products';
import ProductPageServer from '@/components/home/product/ProductPageServer';
import { Suspense } from 'react';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import ProductJsonLd from '@/components/seo/ProductJsonLd';
import ProductSkeleton from '@/components/product/skeletons/ProductSkeleton';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await GetProductsBySlug(slug);

    if (!product) {
        return {
            title: "Producto no encontrado",
            robots: { index: false, follow: true }
        };
    }

    const categoryName = product.categoria?.nombre || 'General';
    const image = product.imagenes?.[0] || '/images/og-main.jpg'; 
    const url = `/productos/${product.slug}`;

    const title = product.metaTitle?.trim() || product.nombre;
    const description = product.metaDescription?.trim() || 
        (product.descripcion
            ? product.descripcion.replace(/<[^>]+>/g, '').slice(0, 160).trim()
            : `Compra ${product.nombre} en GoPhone. Calidad y tecnología con garantía oficial.`);

    const productTags = product.tags ?? [];
    const keywords = [
        product.nombre,
        categoryName,
        ...productTags,
        'GoPhone',
        'Cañete'
    ].filter(Boolean);

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `${title} | GoPhone`,
            description,
            url,
            siteName: 'GoPhone',
            type: 'website',
            images: [
                {
                    url: image,
                    alt: product.nombre,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | GoPhone`,
            description,
            images: [image],
        },
        other: {
            "product:category": categoryName,
            "product:availability": (product.stock ?? 0) > 0 ? "in stock" : "out of stock",
            "product:price:amount": product.precio ? product.precio.toFixed(2) : "0.00",
            "product:price:currency": "PEN",
        }
    };
}

export default async function PageProduct({ params }: Props) {
    const { slug } = await params;
    const producto = await GetProductsBySlug(slug);

    if (!producto) {
        notFound();
    }

    return (
        <main className='md:max-w-screen-2xl mx-auto w-full'>
            <ProductJsonLd producto={producto} />
            <Suspense fallback={<ProductSkeleton />}>
                <ProductPageServer producto={producto} />
            </Suspense>
        </main>
    );
}