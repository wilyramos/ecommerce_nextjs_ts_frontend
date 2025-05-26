import { getOrders } from "@/src/services/orders";




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

    console.log("Orders:", orders);

    const dataOrders = orders ? orders.orders : [];

    return (
        <div className="max-w-7xl mx-auto p-5">
            <div className="flex justify-between mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    Listado de Pedidos
                </h1>
                <div className="flex gap-2">
                    {/* Add any buttons or actions here, e.g., Add Order */}
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
                    {/* Render your orders table or list here */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.createdAt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">test</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-900">Ver Detalles</a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Anterior
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
