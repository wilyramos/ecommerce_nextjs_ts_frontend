import EditCategoryForm from "@/components/admin/category/EditCategoryForm";
import { getCategory, getPatternCategories } from "@/src/services/categorys";
import Link from "next/link";
import DeleteCategoryButton from "@/components/admin/category/DeleteCategoryButton";

type params = Promise<{
    id: string;
}>;

export default async function CategoryPageDetails({ params }: { params: params }) {

    const { id } = await params;
    const category = await getCategory(id);
    const patternCategories = await getPatternCategories();

    return (

        <div className="h-screen overflow-y-auto p-6 bg-white">
            <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-2">
                <h1 className="text-xl font-semibold text-gray-800">{category.nombre}</h1>
                <div className="flex gap-2">
                    <Link
                        href="/admin/products/category"
                        className="bg-gray-700 hover:bg-gray-900 text-white px-3 py-1 rounded text-sm"
                    >
                        Volver
                    </Link>
                    <DeleteCategoryButton categoryId={category._id} />
                </div>
            </div>

            <EditCategoryForm 
                category={category}
                categories={patternCategories}
            />
        </div>

    );
}