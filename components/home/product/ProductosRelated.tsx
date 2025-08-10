import type { Product } from "@/src/schemas";
import ProductCard from "./ProductCard";
import { getProductsRelated } from "@/src/services/products";

export default async function ProductosRelated({ slug }: { slug: string }) {
    const productsRelated = await getProductsRelated(slug);

    if (!productsRelated || productsRelated.length === 0) {
        return (
            <p className="text-gray-200 text-center text-sm mt-6">
                No hay productos relacionados
            </p>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Productos relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {productsRelated.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
