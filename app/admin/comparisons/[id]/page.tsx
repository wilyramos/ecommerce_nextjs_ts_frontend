// File: frontend/app/admin/comparisons/[id]/page.tsx

import { notFound } from "next/navigation";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import EditComparisonClient from "@/components/admin/comparisons/EditComparisonClient";

import { getTokenOptional } from "@/src/auth/dal";
import { comparisonService } from "@/src/services/comparison-service";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import type { CreateComparisonDTO } from "@/src/schemas/comparison.schema";

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditComparisonPage({ params }: EditPageProps) {
    const { id } = await params;
    const token = await getTokenOptional();

    let comparison = null;
    try {
        comparison = await comparisonService.getById(id, token);
    } catch {
        notFound();
    }

    if (!comparison) notFound();

    // 1. Extraer los productos esenciales poblados (ProductSearchResult)
    const productsDetails: ProductSearchResult[] = comparison.products
        .filter((p): p is ProductSearchResult => typeof p === "object" && p !== null && "_id" in p);

    // 2. Extraer los IDs correspondientes para el DTO
    const productIds: string[] = comparison.products.map((p) =>
        typeof p === "string" ? p : p._id
    );

    // 3. Formar la data inicial enriquecida
    const initialData: CreateComparisonDTO & { _id: string; productsDetails?: ProductSearchResult[] } = {
        _id: comparison._id,
        title: comparison.title,
        metaDescription: comparison.metaDescription || "",
        veredictoRapido: comparison.veredictoRapido,
        products: productIds,
        productsDetails,
        especificaciones: comparison.especificaciones,
        faqItems: comparison.faqItems,
    };

    return (
        <AdminPageWrapper
            title="Editar Comparativa"
            breadcrumbItems={[
                { label: "Catálogo", href: "/admin/products" },
                { label: "Comparativas", href: "/admin/comparisons" },
            ]}
            breadcrumbCurrent={comparison.title}
            showBackButton={true}
        >
            <div className="max-w-6xl mx-auto">
                <EditComparisonClient initialData={initialData} />
            </div>
        </AdminPageWrapper>
    );
}