import { getProductsMainPage } from "@/src/services/products";
import ProductGrid from "./product-grid";
import Pagination from "../ui/Pagination";

interface ProductResultsProps {
  searchParams: Record<string, string | undefined>;
}

export default async function ProductResults({ searchParams }: ProductResultsProps) {
  const data = await getProductsMainPage({
    page: Number(searchParams.page) || 1,
    query: searchParams.q,
    category: searchParams.category,
    priceRange: searchParams.priceRange,
    sort: searchParams.sort,
  });

  if (!data || data.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">No encontramos resultados</h2>
        <p className="text-gray-500">Intenta con otros filtros o términos.</p>
      </div>
    );
  }

  return (
    <section>
      <ProductGrid products={data.products} />
      <div className="mt-12">
        <Pagination
          pathname="/search"
          totalPages={data.totalPages}
          currentPage={data.currentPage}
        />
      </div>
    </section>
  );
}