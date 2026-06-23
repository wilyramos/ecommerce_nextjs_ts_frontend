// File: frontend/app/admin/pages/page.tsx

import { PageService } from "@/src/modules/page/page.service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import PageFiltersComponent from "@/src/modules/page/admin/PageFiltersComponent";
import PageTableList from "@/src/modules/page/admin/PageTableList";
import Pagination from "@/components/ui/Pagination";
import { Plus } from "lucide-react";
import Link from "next/link";

interface SearchParams {
    page?: string;
    limit?: string;
    isActive?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function AdminPagesPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));

    // Consumo de la API estandarizada desde el servicio basado en el servidor
    const res = await PageService.getAllPages(page, limit);

    const pagesData = res?.data || [];
    const total = Number(res?.meta?.total ?? 0);
    const totalPages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <AdminPageWrapper
            title="Páginas Institucionales"
            breadcrumbCurrent="Páginas"
            showBackButton={false}
            actions={
                <Link
                    href="/admin/pages/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Página
                </Link>
            }
        >
            <div className="space-y-5">
                {/* Componente reactivo de filtrado por estado de visualización */}
                <PageFiltersComponent 
                    filters={{
                        isActive: params.isActive
                    }} 
                />

                {/* Tabla interactiva para la mutación o eliminación de registros */}
                <PageTableList initialPages={pagesData} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {pagesData.length} de {total} páginas institucionales configuradas
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            limit={limit}
                            pathname="/admin/pages"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}