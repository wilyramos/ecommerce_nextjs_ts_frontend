// File: frontend/components/home/product/ProductosRelated.tsx

import { getProductsRelated } from "@/src/services/products";
import RelatedCarousel from "./RelatedCarousel";
import SectionHeader from "@/components/home/sections/SectionHeader";

export default async function ProductosRelated({ slug }: { slug: string }) {
    const productsRelated = await getProductsRelated(slug);

    if (!productsRelated || productsRelated.length === 0) {
        return null;
    }

    return (
        <section className="flex flex-col mx-auto w-full">
            <SectionHeader
                title="Productos relacionados"
            />
            <div className="relative">
                <RelatedCarousel products={productsRelated} />
            </div>
        </section>
    );
}