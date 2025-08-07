import { getOrders } from "@/src/services/orders";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Pagination from "@/components/ui/Pagination";
import AddOrderButton from "@/components/admin/orders/AddOrderButton";
import { HeadingH1 } from "@/components/ui/Heading";
import OrdersTableFilters from "@/components/admin/orders/OrdersTableFilters";

type PageOrdersProps = {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        pedido?: string;
        fecha?: string;
        estadoPago?: string;
        estadoEnvio?: string;
    }>;
};

export default async function pageOrders({ searchParams }: PageOrdersProps) {

    const params = await searchParams;

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 25;

    // Get orders from the backend

    const data = await getOrders({
        page,
        limit,
        pedido: params.pedido,
        fecha: params.fecha,
        estadoPago: params.estadoPago,
        estadoEnvio: params.estadoEnvio,
    });
    const orders = data?.orders;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between mb-6">
                <HeadingH1>Listado de Pedidos</HeadingH1>
                <div className="flex gap-2">
                    <AddOrderButton />
                </div>
            </div>

            <OrdersTableFilters />


            {!orders ? (
                <div className="flex flex-col ">
                    <h2 className="text-lg sm:text-xl text-gray-600 py-10">
                        No hay pedidos disponibles.
                    </h2>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex justify-center">
                    <h2 className="text-base sm:text-lg text-gray-500">
                        No se encontraron pedidos en esta página.
                    </h2>
                </div>
            ) : (
                <>

                    {/* <OrdersTableFilters /> */}
                    <OrdersTable orders={data} />
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(data.totalOrders / limit)}
                        limit={limit}
                        pathname="/admin/orders"
                    />
                </>
            )}
        </div>
    );
}
