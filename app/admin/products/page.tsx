import AddProductButton from "@/components/admin/products/AddProductButton";

export default function ProductsPage() {






   return (
      <>
         <div className="flex justify-between items-center">

            <h1 className="text-2xl font-bold">Products</h1>
            
            <AddProductButton />
            
         </div>
         <div className="mt-4">
            <p>List of products will be displayed here.</p>
         </div>
         

      </>
   )
}
