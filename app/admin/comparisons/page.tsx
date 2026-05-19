// File: app/(admin)/admin/comparisons/page.tsx

import { ComparisonService } from "@/src/services/comparison-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NuevaComparativa from "@/components/admin/comparisons/NuevaComparativa";
import ComparisonFilters from "@/components/admin/comparisons/ComparisonFilters";
import ComparisonTable from "@/components/admin/comparisons/ComparisonTable";
import Pagination from "@/components/ui/Pagination";
import { Comparison } from "@/src/schemas/comparison.schema";

interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    isActive?: string;
    isFeatured?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function ComparisonsPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const search = params.search?.trim() || undefined;

    const isActive =
        params.isActive === "true" ? true :
        params.isActive === "false" ? false :
        undefined;

    const isFeatured =
        params.isFeatured === "true" ? true :
        params.isFeatured === "false" ? false :
        undefined;

    // Adaptado estrictamente para leer la nueva estructura JSON encapsulada en la respuesta
    const res = await ComparisonService.getAll({
        page,
        limit,
        search,
        isActive,
        isFeatured
    });

    // Desestructuramos el contenido paginado que viaja dentro del objeto unificado de respuesta
    const comparisons = (res?.data || []) as Comparison[];
    const total = Number(res?.total ?? 0);
    const pages = Math.max(1, Number(res?.pages ?? 1));

    return (
        <AdminPageWrapper
            title="Comparativas SEO"
            breadcrumbItems={[{ label: "Contenido", href: "/admin/content" }]}
            breadcrumbCurrent="Comparativas"
            showBackButton={false}
            actions={<NuevaComparativa />}
        >
            <div className="space-y-5">
                <ComparisonFilters
                    filters={{
                        search: params.search,
                        isActive: params.isActive,
                        isFeatured: params.isFeatured
                    }}
                />

                <ComparisonTable comparisons={comparisons} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {comparisons.length} de {total} resultados
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/comparisons"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}