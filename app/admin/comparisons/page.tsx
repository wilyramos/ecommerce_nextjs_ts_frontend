// File: app/(admin)/admin/comparisons/page.tsx

import { ComparisonService } from "@/src/services/comparison-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NuevaComparativa from "@/components/admin/comparisons/NuevaComparativa";
import ComparisonFilters from "@/components/admin/comparisons/ComparisonFilters";
import ComparisonTable from "@/components/admin/comparisons/ComparisonTable";
import Pagination from "@/components/ui/Pagination";

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

/**
 * SERVER COMPONENT: Procesa los parámetros de la URL, consulta el servicio persistido
 * en caché e inyecta la data limpia directamente a los componentes visuales del cliente.
 */
export default async function ComparisonsPage({ searchParams }: PageProps) {
    // En Next.js 15, searchParams se trata explícitamente como una Promesa asíncrona
    const params = await searchParams;

    // Sanitización exhaustiva de parámetros numéricos y de texto para evitar fallos de ejecución
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

    // Consumo del servicio del lado del servidor (Aprovecha next.tags de forma nativa)
    const { comparisons, total, pages } = await ComparisonService.getAll({
        page,
        limit,
        search,
        isActive,
        isFeatured
    });

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
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                        <p className="text-xs text-[var(--color-text-tertiary)] uppercase ">
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