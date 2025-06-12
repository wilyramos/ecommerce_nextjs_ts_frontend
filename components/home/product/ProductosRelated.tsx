import type { Product } from "@/src/schemas";
import ProductCard from "./ProductCard";
import { getProductsRelated } from '@/src/services/products';


export default async function ProductosRelated({ productId }: { productId: string }) {

    const products = await getProductsRelated(productId);

    console.log("Productos relacionados:", products);

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                No hay productos relacionados disponibles.
            </div>
        );
    }

    // console.log("Productos relacionados:", products);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
            ))}

        </div>
    )
}
