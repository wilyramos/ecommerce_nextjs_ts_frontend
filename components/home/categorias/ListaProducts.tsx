import { getProductsByFilter } from "@/src/services/products";
import ProductosList from "../product/ProductsList";
import Pagination from "../Pagination";

type ProductResultsProps = {
  category?: string;
  priceRange?: string;
  page?: string;
  limit?: number;
  sort?: string;
  compatibilidad?: string;
  query?: string;
  atributos?: Record<string, string>; // Nuevos atributos dinámicos
};

export default async function ListaProducts({
  category,
  priceRange,
  page,
  limit = 10,
  sort,
  compatibilidad,
  query,
  atributos = {},
}: ProductResultsProps) {
  const products = await getProductsByFilter({
    page: page ? parseInt(page) : 1,
    limit,
    category: category || "",
    priceRange: priceRange || "",
    query: query || "",
    sort: sort || "",
    compatibilidad: compatibilidad || "",
    atributos,
  });

  if (!products || products.products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No se encontraron productos.
      </div>
    );
  }

  return (
    <>
      <ProductosList products={products} />

      <Pagination
        currentPage={products.currentPage}
        totalPages={products.totalPages}
        limit={limit}
        pathname={`/categoria/${category}`}
        queryParams={{
          priceRange,
          sort,
          compatibilidad,
          query,
          ...atributos, // Muy importante para mantener filtros en la paginación
        }}
      />
    </>
  );
}
