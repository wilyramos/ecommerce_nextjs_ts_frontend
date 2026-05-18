// File: frontend/app/admin/comparisons/edit/[id]/page.tsx

import { ComparisonService } from "@/src/services/comparison-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditComparisonForm from "@/components/admin/comparisons/EditComparisonForm";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditComparisonPage({ params }: PageProps) {
    const { id } = await params;

    try {
        // Se pasa false como segundo argumento para permitir la edición de borradores (isActive: false)
        const { data: comparison } = await ComparisonService.getBySlug(id, false);

        if (!comparison) {
            return notFound();
        }

        return (
            <AdminPageWrapper 
                title={`Editar: ${comparison.title}`}
                breadcrumbItems={[
                    { label: "Home", href: "/admin" },
                    { label: "Comparativas", href: "/admin/comparisons" },
                ]}
                breadcrumbCurrent="Editar"
            >
                <div className="max-w-screen-2xl mx-auto">
                    <EditComparisonForm comparison={comparison} />
                </div>
            </AdminPageWrapper>
        );
    } catch (error) {
        console.error("Error loading comparison for edit:", error);
        return notFound();
    }
}