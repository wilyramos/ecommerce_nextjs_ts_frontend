// File: app/admin/products/category/new/page.tsx

import { getRootCategories } from "@/src/services/categorys";
import CreateCategoryForm from "@/components/admin/category/CreateCategoryForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default async function NewCategoryPage() {
    const rootCategories = await getRootCategories();

    return (
        <AdminPageWrapper
            title="Nueva Categoría"
            breadcrumbItems={[
                { label: "Dashboard", href: "/admin" },
                { label: "Categorías", href: "/admin/products/category" },
            ]}
            breadcrumbCurrent="Nueva"
            showBackButton
        >
            <CreateCategoryForm categories={rootCategories} />
        </AdminPageWrapper>
    );
}