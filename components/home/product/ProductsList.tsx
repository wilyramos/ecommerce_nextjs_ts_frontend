import type { ProductList } from "@/src/schemas";
import ProductCard from "@/components/home/product/ProductCard";

export default function ProductosList({ products }: { products: ProductList }) {


    if (!products || products.products.length === 0) {
        return <div className="text-center text-gray-500">No hay productos disponibles</div>;
    }

    const { products: productList } = products;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {productList.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}