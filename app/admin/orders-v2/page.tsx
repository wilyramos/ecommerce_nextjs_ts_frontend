// File: app/(admin)/admin/orders-v2/page.tsx

import { orderService } from "@/src/services/order-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import OrderFiltersV2 from "@/components/admin/orders/OrderFiltersV2";
import OrderTableV2 from "@/components/admin/orders/OrderTableV2";
import Pagination from "@/components/ui/Pagination";
import { getTokenOptional } from "@/src/auth/dal";
import type { OrderResponse, OrderStatus } from "@/src/schemas/order.schema";

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
    const token = await getTokenOptional();

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 20));

    // Mapeo riguroso de filtros admitidos por tu orderService
    const filters = {
        page,
        limit,
        status: params.status?.trim() as OrderStatus | undefined,
        email: params.email?.trim() || undefined,
        userId: params.userId?.trim() || undefined,
        from: params.from || undefined,
        to: params.to || undefined,
    };

    const res = await orderService.getAllOrders(token ?? "", filters);

    const orders = (res?.data || []) as OrderResponse[];
    const total = Number(res?.meta?.total ?? 0);
    const pages = Math.max(1, Number(res?.meta?.pages ?? 1));

    return (
        <AdminPageWrapper
            title="Gestión de Pedidos"
            breadcrumbItems={[{ label: "Panel", href: "/admin" }]}
            breadcrumbCurrent="Órdenes"
            showBackButton={false}
        >
            <div className="space-y-5">
                <OrderFiltersV2 
                    filters={{
                        status: params.status,
                        email: params.email,
                        from: params.from,
                        to: params.to
                    }} 
                />

                <OrderTableV2 orders={orders} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            Mostrando {orders.length} de {total} órdenes registradas
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/orders"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}