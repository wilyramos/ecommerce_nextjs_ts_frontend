import type { Product } from "@/src/schemas";
import ProductCard from "./ProductCard";


export default function ProductosRelated({ products }: { products: Product[] }) {

    // console.log("Productos relacionados:", products);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    )
}
