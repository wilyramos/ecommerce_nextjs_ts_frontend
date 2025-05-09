import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm"
import Link from "next/link";

export default function NewCategoryPage() {
  return (
    <>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nueva Categoria</h1>
        <Link href="/admin/products/category" className="text-blue-500 hover:underline">
          Ver Categorias
        </Link>
      </div>

      <div>
        <CreateCategoryForm />
      </div>
    </>
  )
}
