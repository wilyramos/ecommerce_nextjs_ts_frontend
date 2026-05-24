// File: frontend/app/admin/collections/[id]/edit/page.tsx

import { collectionService } from "@/src/services/collection-service";
import { CollectionForm } from "@/components/admin/collections/CollectionForm";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCollectionPage({ params }: Props) {
    const resolvedParams = await params;
    const collection = await collectionService.getById(resolvedParams.id).catch(() => null);
    if (!collection) notFound();

    return (
        <AdminPageWrapper
            title={`Editar: ${collection.name}`}
            breadcrumbItems={[{ label: "Colecciones", href: "/admin/collections" }]}
            breadcrumbCurrent="Editar"
            showBackButton={true}
        >
            <CollectionForm collectionToEdit={collection} />
        </AdminPageWrapper>
    );
}