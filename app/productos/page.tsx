import { getProductsHomePage } from "@/src/services/products";
import ProductosList from "@/components/home/product/ProductsList"
import ProductsFilters from "@/components/home/product/ProductsFilters";
import { getCategories } from "@/src/services/categorys";

export default async function PageProducts({ searchParams }: { searchParams: { category?: string; priceRange?: string; brand?: string } }) {
    const products = await getProductsHomePage({
        page: 1,
        limit: 20,
        category: searchParams.category || "",
        priceRange: searchParams.priceRange || "",
        brand: searchParams.brand || "",
    });

    if (!products) {
        return <div>No products found</div>;
    }

    const categorias = await getCategories();

    return (
        <main className="container mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Todos los Productos</h1>

            {/* Filtros */}
            <ProductsFilters categorias={categorias} />

            {/* Lista de productos */}
            <ProductosList products={products} />
        </main>
    );
}