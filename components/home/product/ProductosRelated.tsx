// File: frontend/components/home/product/ProductosRelated.tsx

import { getProductsRelated } from "@/src/services/products";
import RelatedCarousel from "./RelatedCarousel";

export default async function ProductosRelated({ slug }: { slug: string }) {
    const productsRelated = await getProductsRelated(slug);

    if (!productsRelated || productsRelated.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col mx-auto w-full">
            <h2 className="text-md tracking-tighter text-[var(--color-text-primary)]">
                Productos similares
            </h2>
            <div>
                <div className="border-b border-2 border-action-cta w-14 md:w-20 mb-4"></div>
            </div>
            <div className="relative">
                <RelatedCarousel products={productsRelated} />
            </div>
        </section>
    );
}