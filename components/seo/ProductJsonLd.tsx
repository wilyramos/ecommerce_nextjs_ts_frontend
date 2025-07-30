// File: frontend/components/seo/ProductJsonLd.tsx

'use client'

import type { ProductWithCategoryResponse } from "@/src/schemas"

export default function ProductJsonLd({ producto }: { producto: ProductWithCategoryResponse }) {

    if (!producto) return null

    const firstImage = producto.imagenes?.[0] || 'https://www.gophone.pe/default-product.jpg'
    const url = `https://www.gophone.pe/product/${producto.slug}`
    const brand = producto.atributos?.Marca || 'GoPhone'
    const price = producto.precio || 0
    const availability =
        producto.stock && producto.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: producto.nombre,
        image: firstImage,
        description: producto.descripcion?.replace(/\r?\n|\r/g, ' ').trim() || "No description available",
        category: producto.categoria?.nombre || 'General',
        sku: producto.sku || undefined,
        gtin13: producto.barcode || undefined,
        brand: {
            '@type': 'Brand',
            name: brand,
        },
        releaseDate: producto.createdAt?.toString(),
        offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'PEN',
            price: price.toFixed(2),
            itemCondition: 'https://schema.org/NewCondition',
            availability,
            seller: {
                '@type': 'Organization',
                name: 'GoPhone Cañete',
            },
        },
    }


    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
