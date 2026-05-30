// File: app/admin/products/category/page.tsx

import Link from "next/link";
import { getCategories } from "@/src/services/categorys";
import { Button } from "@/components/ui/button";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CategoryTable from "@/components/admin/category/CategoryTable";

export default async function CategoryListPage() {
    const categories = await getCategories();

    return (
        <AdminPageWrapper
            title="Categorías"
            showBackButton={false}
            actions={
                <Button asChild>
                    <Link href="/admin/products/category/new">
                        Nueva categoría
                    </Link>
                </Button>
            }
        >
            <CategoryTable categories={categories} />
        </AdminPageWrapper>
    );
}