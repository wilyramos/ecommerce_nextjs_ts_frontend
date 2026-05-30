// File: app/admin/products/category/[id]/page.tsx

import { getCategory, getRootCategories } from "@/src/services/categorys";
import EditCategoryForm from "@/components/admin/category/EditCategoryForm";
import DeleteCategoryButton from "@/components/admin/category/DeleteCategoryButton";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

type Props = { params: Promise<{ id: string }> };

export default async function CategoryDetailPage({ params }: Props) {
    const { id } = await params;

    const [category, rootCategories] = await Promise.all([
        getCategory(id),
        getRootCategories(),
    ]);

    return (
        <AdminPageWrapper
            title={category.nombre}
            breadcrumbItems={[
                { label: "Dashboard", href: "/admin" },
                { label: "Categorías", href: "/admin/products/category" },
            ]}
            breadcrumbCurrent={category.nombre}
            showBackButton
            actions={
                <DeleteCategoryButton categoryId={category._id} categoryName={category.nombre} />
            }
        >
            <EditCategoryForm category={category} categories={rootCategories} />
        </AdminPageWrapper>
    );
}