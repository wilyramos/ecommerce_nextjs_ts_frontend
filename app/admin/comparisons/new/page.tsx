// File: frontend/app/admin/comparisons/new/page.tsx
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreateComparisonClient from "@/components/admin/comparisons/CreateComparisonClient";

export default function NewComparisonPage() {
    return (
        <AdminPageWrapper
            title="Crear Nueva Comparativa"
            breadcrumbItems={[
                { label: "Catálogo", href: "/admin/products" },
                { label: "Comparativas", href: "/admin/comparisons" },
            ]}
            breadcrumbCurrent="Nueva"
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <CreateComparisonClient />
            </div>
        </AdminPageWrapper>
    );
}