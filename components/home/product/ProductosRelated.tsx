import type { Product } from "@/src/schemas";
import ProductCard from "./ProductCard";
import { getProductsRelated } from "@/src/services/products";


export default async function ProductosRelated({ slug }: { slug: string }) {

    const productsRelated = await getProductsRelated(slug);

    if (!productsRelated) {
        return (
            <>
                <h1 className="text-gray-200 text-sm text-center justify-center items-center">
                    sin productos relacionados
                </h1>
            </>
        )
    }

    // console.log("Productos relacionados:", products);

    return (
        <>

            {productsRelated.length > 0 ? (
                <section className="bg-gray-50 px-4 py-8 rounded-2xl shadow-md">

                <h2 className="text-gray-600 font-bold text-lg py-4">
                    Productos relacionados
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productsRelated.map((product: Product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}

                </div>
                </section>

            ) : (
                <h1 className="text-gray-200 text-sm text-center justify-center items-center">
                    sin productos relacionados
                </h1>
            )}

        </>
    )
}
