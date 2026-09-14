// File: frontend/app/admin/comparisons/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import ComparisonFilters from "@/components/admin/comparisons/ComparisonFilters";
import ComparisonTable from "@/components/admin/comparisons/ComparisonTable";
import PaginationBanner from "@/components/ui/PaginationBanner";
import NewComparisonButton from "@/components/admin/comparisons/NewComparisonButton";
import * as Typo from "@/components/ui/Typography";
import { getTokenOptional } from "@/src/auth/dal";
import { comparisonService } from "@/src/services/comparison-service";
import { type ComparisonResponse } from "@/src/schemas/comparison.schema";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>;
}

export default async function AdminComparisonsPage({ searchParams }: PageProps) {
    const token = await getTokenOptional();

    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const search = params.search?.trim() || "";

    let comparisons: ComparisonResponse[] = [];
    let meta = { total: 0, page: 1, pages: 1, limit };

    try {
        const comparisonData = await comparisonService.getAllAdmin(
            { page, limit, search },
            token
        );
        comparisons = comparisonData.items;
        meta = {
            total: comparisonData.meta.total ?? 0,
            page: comparisonData.meta.page ?? page,
            pages: comparisonData.meta.pages ?? 1,
            limit: comparisonData.meta.limit ?? limit,
        };
    } catch (error) {
        console.error("[AdminComparisonsPage] Error al cargar la lista de comparativas:", error);
    }

    return (
        <AdminPageWrapper
            title="Comparativas de Productos"
            breadcrumbItems={[{ label: "Catálogo", href: "/admin/products" }]}
            breadcrumbCurrent="Comparativas"
            showBackButton={true}
            actions={<NewComparisonButton />}
        >
            <div className="space-y-4 text-foreground">
                <ComparisonFilters />

                <div className="border border-border rounded-lg bg-card p-4 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <Typo.H3>Comparativas Registradas</Typo.H3>
                        <Typo.Small className="text-muted-foreground font-mono">
                            {meta.total} {meta.total === 1 ? "Resultado" : "Resultados"}
                        </Typo.Small>
                    </div>

                    <ComparisonTable comparisons={comparisons} />

                    {comparisons.length > 0 && (
                        <PaginationBanner
                            currentPage={meta.page}
                            totalPages={meta.pages}
                            limit={meta.limit}
                            totalItems={meta.total}
                            itemsShown={comparisons.length}
                            pathname="/admin/comparisons"
                        />
                    )}
                </div>
            </div>
        </AdminPageWrapper>
    );
}