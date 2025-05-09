import AddProductButton from "@/components/admin/products/AddProductButton";
import Link from "next/link";
import { getProducts } from "@/src/services/products";


type SearchParams = Promise<{
   page: number;
   limit: number;
}>; // Define the type for searchParams, which is a Promise that resolves to an object with page and limit properties

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {

   const { page, limit } = await searchParams;

   // Fetch products from the API
   const products = await getProducts({ page, limit });


   if (!products) {
      return (
         <div className="flex justify-center items-center h-screen bg-gray-50">
            <h1 className="text-3xl font-semibold text-gray-700">No hay productos</h1>
         </div>
      );
   }
   const totalPages = Math.ceil(products.totalProducts / limit);
   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

         <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-100">
                  <tr>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                     <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {products.products.map((product) => (
                     <tr key={product._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.descripcion}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">${product.precio}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                        <td className="px-6 py-4 text-sm">
                           <Link href={`/admin/products/${product._id}`} className="text-blue-600 hover:underline">
                              Ver Detalles
                           </Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="flex justify-center mt-8">
            <nav className="inline-flex items-center space-x-2">
               {products.currentPage > 1 && (
                  <Link
                     href={`/admin/products?page=${products.currentPage - 1}&limit=${limit}`}
                     className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                     ← Anterior
                  </Link>
               )}

               {
                  pages.map((page) => (
                     <Link
                        key={page}
                        href={`/admin/products?page=${page}&limit=${limit}`}
                        className={`px-3 py-2 text-sm border rounded-lg ${products.currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 border-gray-300 hover:bg-gray-100 transition'}`}
                     >
                        {page}
                     </Link>
                  ))
               }

               {products.currentPage < products.totalPages && (
                  <Link
                     href={`/admin/products?page=${products.currentPage + 1}&limit=${limit}`}
                     className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                     Siguiente →
                  </Link>
               )}
            </nav>
         </div>

      </div>
   );
}