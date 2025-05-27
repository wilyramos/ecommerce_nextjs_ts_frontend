import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Pagination from "@/components/ui/Pagination";
import AddOrderButton from "@/components/admin/orders/AddOrderButton";



type PageOrdersProps = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
};

export default async function pageOrders({ searchParams }: PageOrdersProps) {

    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    // Get orders from the backend

    const orders = await getOrders({ page, limit });

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    Listado de Pedidos
                </h1>
                <div className="flex gap-2">
                    <AddOrderButton />
                </div>
            </div>

            {!orders ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
                        No hay pedidos disponibles.
                    </h2>
                </div>
            ) : orders.orders.length === 0 ? (
                <div className="flex justify-center min-h-[200px]">
                    <h2 className="text-base sm:text-lg text-gray-500">
                        No se encontraron pedidos en esta página.
                    </h2>
                </div>
            ) : (
                <>
                    <OrdersTawble orders={orders} />
                    <Pagination 
                        currentPage={page}
                        totalPages={Math.ceil(orders.totalOrders / limit)}
                        limit={limit}
                        pathname="/admin/orders"
                    />
                </>
            )}
        </div>
    );
}
