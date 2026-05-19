// File: app/(admin)/admin/comparisons/edit/[id]/page.tsx

import { ComparisonService } from "@/src/services/comparison-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditComparisonForm from "@/components/admin/comparisons/EditComparisonForm";
import { notFound } from "next/navigation";
import { Comparison } from "@/src/schemas/comparison.schema";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditComparisonPage({ params }: PageProps) {
    const { id } = await params;
    const res = await ComparisonService.getById(id);

    // Mapeamos los datos con tipado estricto basándonos en tu esquema Zod
    const comparison = res.data as Comparison;

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

}