// File: frontend/app/(store)/productos/[slug]/page.tsx

import { GetProductsBySlug } from '@/src/services/products';
import ProductPageServer from '@/components/home/product/ProductPageServer';
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import ProductJsonLd from '@/components/seo/ProductJsonLd';

type Params = Promise<{
    slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const product = await GetProductsBySlug(slug);

    if (!product) {
        notFound(); // redirige a 404 si no existe
    }

    const title = `${product.nombre}`;

    // Limpiar EL HTML y solo mostrar texto plano
    const description = product.descripcion
        ? product.descripcion.replace(/<[^>]+>/g, '').slice(0, 160)
        : 'Descubre nuestros productos en GoPhone. Calidad y tecnología a tu alcance.';
    const categoryName = product.categoria?.nombre || 'General';
    const image = product.imagenes?.[0] || 'https://www.gophone.pe/logomini.svg';
    const url = `https://www.gophone.pe/productos/${product.slug}`;

    return {
        title,
        description,
        keywords: [
            product.nombre,
            categoryName,
            'GoPhone',
            'Cañete',
            'Productos',
            'Tienda Online',
            'San Vicente de Cañete',
            'Perú',
            'iPhone',
            'Celulares',
            'Accesorios',
            'Tecnología',
            'Smartphones',
        ],
        openGraph: {
            title,
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
            locale: 'es_PE',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@GoPhone', // opcional si tienes cuenta de Twitter
        },
        icons: {
            icon: "/logobw.jpg",
            apple: "/logobw.jpg",
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        },
        other: {
            "product:category": categoryName,
            "product:availability": (product?.stock ?? 0) > 0 ? "in stock" : "out of stock",
            "product:price:amount": product?.precio ? product.precio.toFixed(2) : "",
            "product:price:currency": "PEN",
        }
    }
}

export default async function pageProduct({ params }: { params: Params }) {
    const { slug } = await params;
    const producto = await GetProductsBySlug(slug);

    return (
        <main className='md:max-w-screen-2xl mx-auto '>
            <ProductJsonLd producto={producto} />
            <Suspense fallback={<SpinnerLoading />}>
                <ProductPageServer producto={producto} />
            </Suspense>
        </main>
    );
}