import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm";
import Link from "next/link";

export default function CreatePageCategory() {
    return (
        <>

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Categorias</h1>
                <Link href="/admin/products/category/new" className="text-blue-500 hover:underline">
                    Nueva Categoria
                </Link>
            </div>
            <div className="mt-4">
                <Link href="/admin/products" className="text-blue-500 hover:underline">
                    Ver Productos
                </Link>
            </div>

            <div className="p-10 mt-10">

                Lista de Categorias
            </div>
        </>
    )
}
