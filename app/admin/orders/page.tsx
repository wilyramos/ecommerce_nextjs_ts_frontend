// File: frontend/app/admin/orders/page.tsx

import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Pagination from "@/components/ui/Pagination";
import AddOrderButton from "@/components/admin/orders/AddOrderButton";
import OrdersTableFilters from "@/components/admin/orders/OrdersTableFilters";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { H2 } from "@/components/ui/Typography";

type PageOrdersProps = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        pedido?: string;
        fecha?: string;
        fechaFin?: string;
        estadoPago?: string;
        estadoEnvio?: string;
        montoMin?: string;
        montoMax?: string;
    }>;
};

export default async function pageOrders({ searchParams }: PageOrdersProps) {
    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 25;

    const data = await getOrders({
        page,
        limit,
        pedido: params.pedido,
        fecha: params.fecha,
        fechaFin: params.fechaFin,
        estadoPago: params.estadoPago,
        estadoEnvio: params.estadoEnvio,
        montoMin: params.montoMin,
        montoMax: params.montoMax,
    });

    const orders = data?.orders;
    const totalOrders = data?.totalOrders || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    return (
        <AdminPageWrapper
            title="Pedidos"
            showBackButton={false}
            actions={<AddOrderButton />}
        >
            <div className="space-y-4">
                <OrdersTableFilters />

                {!orders ? (
                    <div className="flex flex-col items-center justify-center p-10 border border-border rounded-[var(--radius-lg)] bg-card">
                        <H2 className="text-muted-foreground select-none">
                            No hay pedidos disponibles.
                        </H2>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 border border-border rounded-[var(--radius-lg)] bg-card">
                        <H2 className="text-muted-foreground select-none">
                            No se encontraron pedidos con los filtros aplicados.
                        </H2>
                    </div>
                ) : (
                    <>
                        <OrdersTable orders={orders} />
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            limit={limit}
                            pathname="/admin/orders"
                        />
                    </>
                )}
            </div>
        </AdminPageWrapper>
    );
}