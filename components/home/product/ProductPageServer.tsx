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
    { label: "Catálogo", href: routes.catalog() },
  ];

  if (producto.categoria && typeof producto.categoria === 'object') {
    breadcrumbSegments.push({
      label: producto.categoria.nombre,
      href: routes.catalog({ category: producto.categoria.slug }),
    });
  }

  if (producto.brand && typeof producto.brand === 'object') {
    breadcrumbSegments.push({
      label: producto.brand.nombre,
      href: routes.catalog({
        category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
        brand: producto.brand.slug,
      }),
    });
  }

  if (producto.line && typeof producto.line === 'object') {
    breadcrumbSegments.push({
      label: producto.line.nombre,
      href: routes.catalog({
        category: typeof producto.categoria === 'object' ? producto.categoria.slug : undefined,
        brand: typeof producto.brand === 'object' ? producto.brand.slug : undefined,
        line: producto.line.slug,
      }),
    });
  }

  return (
    <>
      <h1 className="sr-only">
        {producto.nombre} - GOPHONE
      </h1>

      <div className="w-full space-y-6">
        <Breadcrumbs
          items={breadcrumbSegments}
          current={producto.nombre}
        />

        <ProductDetails
          producto={producto}
          automaticDiscounts={automaticDiscounts}
        />

        <section aria-label="Productos relacionados" className="w-full pt-10">
          <ProductosRelated slug={producto.slug} />
        </section>

        <section aria-label="Productos vistos recientemente" className="w-full pt-6">
          <RecentViewed currentProduct={producto} />
        </section>
      </div>
    </>
  );
}