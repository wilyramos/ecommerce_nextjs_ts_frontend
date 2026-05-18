// File: app/(admin)/admin/comparisons/new/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreateComparisonForm from "@/components/admin/comparisons/CreateComparisonForm";

export default function NewComparisonPage() {
    return (
        <AdminPageWrapper 
            title="Nueva Comparativa SEO"
            breadcrumbItems={[
                { label: "Home", href: "/admin" },
                { label: "Comparativas", href: "/admin/comparisons" },
            ]}
            breadcrumbCurrent="Nueva Comparativa"
        >
            <div className="max-w-screen-2xl mx-auto">
                <CreateComparisonForm />
            </div>
        </AdminPageWrapper>
    );
}