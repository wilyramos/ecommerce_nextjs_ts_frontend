import AddProductButton from "@/components/admin/products/AddProductButton";
import Link from "next/link";
import { getProducts } from "@/src/services/products";
import ProductsTable from "@/components/admin/products/ProductsTable";


type SearchParams = Promise<{
   page: number;
   limit: number;
}>; // Define the type for searchParams, which is a Promise that resolves to an object with page and limit properties

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

   const { page, limit } = await searchParams;

   // Set default value for limit if not provided
   const limitValue = limit ? +limit : 5;

   // Fetch products from the API
   const products = await getProducts({ page, limit: limitValue });


   if (!products) {
      return (
         <div className="flex justify-center items-center h-screen bg-gray-50">
            <h1 className="text-3xl font-semibold text-gray-700">No hay productos</h1>
         </div>
      );
   }
   const totalPages = Math.ceil(+products.totalProducts / limitValue);
   const pages = Array.from({ length: +totalPages }, (_, i) => i + 1);

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         {/* Header */}
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Listado de Productos</h1>
            <AddProductButton />
         </div>

         {/* Categorías */}
         <div className="mb-4">
            <Link href="/admin/products/category" className="text-blue-600 hover:underline text-sm">
               Ver Categorías →
            </Link>
         </div>

         <ProductsTable products={products} />

         <div className="flex justify-center mt-8">
            <nav className="inline-flex items-center space-x-2">
               {products.currentPage > 1 && (
                  <Link
                     href={`/admin/products?page=${products.currentPage - 1}&limit=${limitValue}`}
                     className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                     &lt;
                  </Link>
               )}

               {
                  pages.map((page) => (
                     <Link
                        key={page}
                        href={`/admin/products?page=${page}&limit=${limitValue}`}
                        className={`px-3 py-2 text-sm border rounded-lg ${products.currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 border-gray-300 hover:bg-gray-100 transition'}`}
                     >
                        {page}
                     </Link>
                  ))
               }

               {products.currentPage < products.totalPages && (
                  <Link
                     href={`/admin/products?page=${products.currentPage + 1}&limit=${limitValue}`}
                     className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                     &gt;
                  </Link>
               )}
            </nav>
         </div>

      </div>
   );
}