// File: frontend/app/admin/collections/new/page.tsx

import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";

export default function NewCollectionPage() {
    return (
        <AdminPageWrapper
            title="Crear colección"
            breadcrumbItems={[{ label: "Colecciones", href: "/admin/collections" }]}
            breadcrumbCurrent="Nueva"
            showBackButton={true}
        >
            <CollectionForm />
        </AdminPageWrapper>
    );
}