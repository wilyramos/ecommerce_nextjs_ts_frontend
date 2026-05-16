import { SaleService, SaleFilters } from "@/src/services/sale-service";
import { SalesTable } from "@/src/components/sales/sales-table";
import { SalesFilters } from "@/src/components/sales/sales-filters";
import Pagination from "@/components/ui/Pagination";

/**
 * Tipamos los searchParams para evitar 'any'
 * Next.js 15 requiere que searchParams sea una Promise
 */
interface SalesPageProps {
    searchParams: Promise<SaleFilters>;
}

export default async function SalesPage({ searchParams }: SalesPageProps) {
    // Resolvemos los parámetros de búsqueda de la URL
    const filters = await searchParams;

    // Fetch de datos con tipado estricto
    const {
        sales,
        totalPages,
        currentPage,
        total
    } = await SaleService.getHistory(filters);

    console.log(sales);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[var(--color-bg-primary)]">

            {/* Área de Filtros y Exportación */}
            <SalesFilters />

            {/* Contenedor de Tabla con diseño de tarjeta */}
            <div className="flex flex-col">
                <div className="overflow-x-auto">
                    <SalesTable initialData={sales} />
                </div>

                {/* Footer con Paginación e información de resultados */}
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-default)]">
                    <div className="hidden sm:block">
                        <p className="text-xs text-[var(--color-text-tertiary)] font-medium">
                            Página <span className="text-[var(--color-text-primary)]">{currentPage}</span> de {totalPages}
                        </p>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        limit={Number(filters.limit) || 10}
                        pathname="/sales"
                    />
                    <div className="hidden sm:block">
                        <p className="text-xs text-[var(--color-text-tertiary)] font-medium">
                            Total de ventas: <span className="text-[var(--color-text-primary)]">{total}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}