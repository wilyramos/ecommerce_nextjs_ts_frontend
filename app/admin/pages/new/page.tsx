// File: frontend/app/admin/pages/new/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import CreatePageForm from "@/src/modules/page/admin/CreatePageForm";

export default function AdminNewPage() {
    return (
        <AdminPageWrapper
            title="Crear Nueva Página"
            breadcrumbItems={[
                { label: "Panel", href: "/admin" },
                { label: "Páginas", href: "/admin/pages" }
            ]}
            breadcrumbCurrent="Nueva Página"
            showBackButton={true}
        >
            <div className="max-w-7xl mx-auto">
                <CreatePageForm />
            </div>
        </AdminPageWrapper>
    );
}