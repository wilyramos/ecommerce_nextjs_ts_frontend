import AddProductButton from "@/components/admin/products/AddProductButton";
import Link from "next/link";

export default function ProductsPage() {






   return (
      <>
         <div className="flex justify-between items-center">

            <h1 className="text-2xl font-bold">Products</h1>
            
            <AddProductButton />
            
         </div>
         <div className="mt-4">
            <Link href="/admin/products/category" className="text-blue-500 hover:underline">
               Ver Categorias
            </Link>
         </div>
         
         

      </>
   )
}
