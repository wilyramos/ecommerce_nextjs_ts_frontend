//File: frontend/app/admin/products/category/page.tsx

import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import Pagination from "@/components/ui/Pagination";
import VisualCategoryView from "@/components/admin/category/VisualCategoryView";
import { Button } from "@/components/ui/button";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";


export default async function CreatePageCategory() {


    const categories = await getCategories();

    return (

        <AdminPageWrapper
            title="Categorías"
            showBackButton={false}
            actions={
                <Link href="/admin/products/category/new">
                    <Button variant="default">Nueva categoría</Button>
                </Link>
            }
        >
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
        </AdminPageWrapper>
    );
}