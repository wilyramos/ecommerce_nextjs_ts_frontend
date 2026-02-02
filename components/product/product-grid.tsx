import { ProductResponse } from "@/src/schemas";
import ProductCard from "./product-card";

interface ProductGridProps {
    products: ProductResponse[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}