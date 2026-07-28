// File: frontend/app/(admin)/admin/orders-v2/page.tsx

import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrderFiltersV2 from "@/components/admin/orders/OrderFiltersV2";
import OrderTableV2 from "@/components/admin/orders/OrderTableV2";
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

export default async function AdminOrdersPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 20));

    const filters = {
        page,
        limit,
        status: params.status?.trim() as OrderStatus | undefined,
        email: params.email?.trim() || undefined,
        userId: params.userId?.trim() || undefined,
        from: params.from || undefined,
        to: params.to || undefined,
    };

    // Petición en paralelo
    const [{ orders, meta }, stats] = await Promise.all([
        orderService.getAllOrders(filters),
        orderService.getOrderStats({ from: filters.from, to: filters.to }),
    ]);

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
    };

    return (
        <AdminPageWrapper
            title="Gestión de Pedidos"
            showBackButton={false}
        >
            {/* ─── BARRA DE ESTADÍSTICAS ENFOCADA EN ÓRDENES PAGADAS Y STOCK ─── */}
            <div className="rounded-lg border border-border bg-card shadow-sm p-4 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
                    
                    {/* Órdenes Pagadas */}
                    <div className="flex flex-col px-4 py-2 first:pl-0">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Órdenes Pagadas
                        </span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {stats.paidOrders}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Pagos confirmados</span>
                    </div>

                    {/* Stock Descontado */}
                    <div className="flex flex-col px-4 py-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Items Descontados
                        </span>
                        <span className="text-2xl font-bold text-foreground mt-1">
                            {stats.itemsDiscounted}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Unidades fuera de stock</span>
                    </div>

                    {/* Ingresos Recaudados */}
                    <div className="flex flex-col px-4 py-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Ingresos Cobrados
                        </span>
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                            {formatMoney(stats.paidRevenue)}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Ventas efectivas</span>
                    </div>

                    {/* Pendientes de Despacho */}
                    <div className="flex flex-col px-4 py-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Por Despachar
                        </span>
                        <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {stats.pendingFulfillment}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Pagados en preparación</span>
                    </div>

                    {/* Reversiones por Reembolso */}
                    <div className="flex flex-col px-4 py-2 last:pr-0">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Reembolsos
                        </span>
                        <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                            {formatMoney(stats.salesReversals)}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">Stock restituido</span>
                    </div>

                </div>
            </div>

            {/* ─── FILTROS Y TABLA ─── */}
            <div className="space-y-5">
                <OrderFiltersV2
                    filters={{
                        status: params.status,
                        email: params.email,
                        from: params.from,
                        to: params.to
                    }}
                />

                <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                    <OrderTableV2 orders={orders} />
                </div>

                {/* ─── BANNER DE PAGINACIÓN CUSTOM COMPLETO ─── */}
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