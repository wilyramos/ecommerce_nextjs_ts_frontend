import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/ui/Pagination";
import VisualCategoryView from "@/components/admin/category/VisualCategoryView";
import { HeadingH1 } from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";


export default async function CreatePageCategory() {


    const categories = await getCategories();

    return (
        <div className="max-w-7xl mx-auto ">
            <div className="flex justify-between border-b-2 pb-4">
                <HeadingH1>Categorías</HeadingH1>

                <Link href="/admin/products/category/new">
                    <Button>
                        Nueva categoría
                    </Button>
                </Link>
            </div>


            {!categories ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-lg">
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