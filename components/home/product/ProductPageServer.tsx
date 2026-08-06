// File: frontend/app/(store)/productos/[slug]/ProductPageServer.tsx
import ProductDetails from '@/components/home/product/ProductDetails';
import ProductosRelated from '@/components/home/product/ProductosRelated';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import RecentViewed from '@/components/home/product/RecentViewed';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import { routes } from "@/lib/routes";
import { discountService } from '@/src/services/discount-service';

type Props = {
    producto: ProductWithCategoryResponse;
};

export default async function ProductPageServer({ producto }: Props) {

    if (!producto) return null;
    const automaticDiscounts = await discountService.getAutomaticDiscountsForProduct(producto._id);
    const breadcrumbSegments = [
        { label: "Catálogo", href: routes.catalog() }
    ];

    if (producto.categoria && typeof producto.categoria === 'object') {
        breadcrumbSegments.push({
            label: producto.categoria.nombre,
            href: routes.catalog({ category: producto.categoria.slug })
        });
    }

    if (producto.brand && typeof producto.brand === 'object') {
        breadcrumbSegments.push({
            label: producto.brand.nombre,
            href: routes.catalog({
                category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
                brand: producto.brand.slug
            })
        });
    }

    if (producto.line && typeof producto.line === 'object') {
        breadcrumbSegments.push({
            label: producto.line.nombre,
            href: routes.catalog({
                category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
                brand: typeof producto.brand === 'object' ? producto.brand.slug : undefined,
                line: producto.line.slug
            })
        });
    }

    return (
        <>
            <h1 className="sr-only">
                {producto.nombre} - GOPHONE
            </h1>

            <section className="container mx-auto  py-1 md:pt-5">
                <Breadcrumbs
                    items={breadcrumbSegments}
                    current={producto.nombre}
                />

                {/* Se adaptó el contenedor eliminando el div hijo innecesario */}
                <div className="pt-2">
                    <ProductDetails
                        producto={producto}
                        automaticDiscounts={automaticDiscounts}
                    />                
                </div>
            </section>

            <section className="container mx-auto  py-4">
                <ProductosRelated slug={producto.slug} />
            </section>

            <section className="container mx-auto  py-4">
                <RecentViewed currentProduct={producto} />
            </section>
        </>
    );
}