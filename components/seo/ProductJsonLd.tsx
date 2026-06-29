// File: frontend/components/seo/ProductJsonLd.tsx
import type { ProductWithCategoryResponse } from "@/src/schemas";

export default function ProductJsonLd({ producto }: { producto: ProductWithCategoryResponse }) {
    if (!producto) return null;

    const firstImage = producto.imagenes?.[0] || '/images/og-main.jpg';
    const url = `https://gophone.pe/productos/${producto.slug}`;
    const brandName = producto.atributos?.Marca || producto.brand?.nombre || 'GoPhone';

    const price = (producto.precio ?? 0).toFixed(2);
    const availability = (producto.stock ?? 0) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    // Generar objeto base limpio sin saltos de línea HTML
    const plainDescription = producto.descripcion
        ? producto.descripcion.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200)
        : 'Descubre los detalles de este producto en nuestra tienda oficial.';

    const structuredData: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: producto.nombre,
        image: [firstImage],
        description: plainDescription,
        brand: {
            '@type': 'Brand',
            name: brandName,
        },
        offers: {
            '@type': 'Offer',
            url,
            price,
            priceCurrency: 'PEN',
            itemCondition: 'https://schema.org/NewCondition',
            availability,
            seller: {
                '@type': 'Organization',
                name: 'GoPhone',
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '10.00',
                    currency: 'PEN'
                },
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'PE'
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        value: 1,
                        unitCode: 'DAY'
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        value: 3,
                        unitCode: 'DAY'
                    }
                }
            },
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 7,
                returnMethod: 'https://schema.org/ReturnByMail',
                applicableCountry: 'PE',
                returnFees: 'https://schema.org/FreeReturn'
            }
        }
    };

    // Agregar identificadores únicamente si existen y son válidos
    const cleanSku = producto.sku?.replace(/[^a-zA-Z0-9_-]/g, '');
    if (cleanSku) structuredData.sku = cleanSku;
    
    if (producto.barcode && producto.barcode.trim().length > 0) {
        structuredData.gtin13 = producto.barcode.trim();
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}