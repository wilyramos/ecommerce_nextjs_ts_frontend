import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/ui/Pagination";
import VisualCategoryView from "@/components/admin/category/VisualCategoryView";
import { Heading1 } from "lucide-react";
import { HeadingH1 } from "@/components/ui/Heading";


export default async function CreatePageCategory() {


    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between mb-6 border-b pb-2">
                <HeadingH1>Categorías</HeadingH1>

                <Link
                    href="/admin/products/category/new"
                    className="inline-flex items-center px-4 py-2s bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
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
                    <VisualCategoryView categories={categories} />
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