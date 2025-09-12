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
        <section className="my-8 flex flex-col  mx-auto ">
            <h2 className="text-xl font-bold">
                PRODUCTOS RELACIONADOS
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 text-start">
                {productsRelated.map((product: Product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
}
