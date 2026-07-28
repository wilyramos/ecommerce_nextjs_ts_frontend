// File: frontend/app/(admin)/admin/orders-v2/page.tsx

import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrderFiltersV2 from "@/components/admin/orders/OrderFiltersV2";
import OrderTableV2 from "@/components/admin/orders/OrderTableV2";
import OrderStatsCards from "@/components/admin/orders/OrderStatsCards";
import PaginationBanner from "@/components/ui/PaginationBanner";
import type { OrderStatus } from "@/src/schemas/order.schema";

interface SearchParams {
    page?: string;
    limit?: string;
    status?: string;
    email?: string;
    userId?: string;
    from?: string;
    to?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

// Helpers de fecha para el servidor
function formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDefaultStartDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 20));

    // Si la URL no tiene fechas ('from' o 'to'), asignamos por defecto los últimos 7 días
    const defaultStartStr = formatDateToString(getDefaultStartDate());
    const defaultEndStr = formatDateToString(new Date());

    const activeFrom = params.from || defaultStartStr;
    const activeTo = params.to || defaultEndStr;

    const filters = {
        page,
        limit,
        status: params.status?.trim() as OrderStatus | undefined,
        email: params.email?.trim() || undefined,
        userId: params.userId?.trim() || undefined,
        from: activeFrom,
        to: activeTo,
    };

    // Petición en paralelo aplicando estrictamente el rango de la última semana por defecto
    const [{ orders, meta }, stats] = await Promise.all([
        orderService.getAllOrders(filters),
        orderService.getOrderStats({ from: filters.from, to: filters.to }),
    ]);

    return (
        <AdminPageWrapper
            title="Gestión de Pedidos"
            showBackButton={false}
        >
            {/* Componente Modular de Estadísticas */}
            <OrderStatsCards stats={stats} />

            {/* Filtros, Tabla y Paginación */}
            <div className="space-y-5">
                <OrderFiltersV2
                    filters={{
                        status: params.status,
                        email: params.email,
                        from: activeFrom,
                        to: activeTo
                    }}
                />

                <div className="border border-border bg-card overflow-hidden">
                    <OrderTableV2 orders={orders} />
                </div>

                <PaginationBanner
                    currentPage={meta.page}
                    totalPages={meta.pages}
                    limit={meta.limit || limit}
                    totalItems={meta.total}
                    itemsShown={orders.length}
                    pathname="/admin/orders-v2"
                    limitOptions={[10, 20, 50, 100]}
                />
            </div>
        </AdminPageWrapper>
    );
}