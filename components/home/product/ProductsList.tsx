import type { TProductsApiResponseWithFilters } from "@/src/schemas";
import ProductCard from "@/components/home/product/ProductCard";

export default function ProductosList({ products }: { products: TProductsApiResponseWithFilters["products"] }) {

    if (!products || products.length === 0) {
        return <div className="text-center text-gray-500">No hay productos disponibles</div>;
    }

    const productList = products.slice(0, 24);
    

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productList.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))} 
            </div>
        </>
    );
}