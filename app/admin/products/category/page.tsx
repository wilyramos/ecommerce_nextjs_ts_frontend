import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/ui/Pagination";
import CategoriesTable from "@/components/admin/category/CategoriesTable";
import { buildCategoryTree } from "@/src/utils/buildCategoryTree";

// async function getCategories() {
//     const url = `${process.env.API_URL}/category/list`;
//     const res = await fetch(url, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });

//     const json = await res.json();
//     const categories = CategoriesAPIResponse.parse(json);
//     return categories;
// }

export default async function CreatePageCategory() {

    const categories = await getCategories();
    const categoriesTree = buildCategoryTree(categories);


    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    Categorías
                </h1>
                
                <Link
                    href="/admin/products/category/new"
                    className="bg-blue-600 text-white px-2 py-1 rounded-xl hover:bg-blue-700 transition"
                >
                    + Nueva Categoría
                </Link>
            </div>


            {!categories ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
                        No hay categorías disponibles.
                    </h2>
                </div>
            ) : (
                <>
                    <CategoriesTable categories={categoriesTree} />
                    <Pagination
                        currentPage={1}
                        totalPages={1}
                        pathname="/admin/products/category"
                    />
                </>
            )}
        </div>
    );
}