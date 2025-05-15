import EditCategoryForm from "@/components/admin/category/EditCategoryForm";
import { getCategory } from "@/src/services/categorys";
import Link from "next/link";

type params = Promise<{
    id: string;
}>;

export default async function CategoryPageDetails({ params }: { params: params }) {

    const { id } = await params;
    const category = await getCategory(id);


    return (
        <div className="p-6">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 ">
                        Category Details
                    </h1>
                    <Link
                        href="/admin/products/category" // Corrected path
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700 transition-colors"
                    >
                        ← Back to Categories
                    </Link>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Edit Category
                    </h3>
                    <EditCategoryForm category={category} />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900 ">
                        Products
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        List of products in the category: {category.nombre}
                    </p>

                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">

                        <ul className="list-disc list-inside space-y-2">
                            <li className="text-gray-900 ">Product 1</li>
                            <li className="text-gray-900 ">Product 2</li>
                            <li className="text-gray-900 ">Product 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}