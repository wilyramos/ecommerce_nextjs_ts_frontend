import type { OrdersList } from '@/src/schemas';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';



export default function OrdersTable({ orders }: { orders: OrdersList }) {


    console.log(orders);

    if (!orders || orders.orders.length === 0) {
        return (
            <div className="flex justify-center min-h-[200px]">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-600">
                    No hay pedidos disponibles.
                </h2>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-1">Order</th>
                        <th className="px-4 py-1 hidden md:table-cell">Fecha</th>
                        <th className="px-4 py-1 hidden md:table-cell">Cliente</th>
                        <th className="px-4 py-1 hidden md:table-cell">Total</th>
                        <th className="px-4 py-1">Estado de pago</th>
                        <th className="px-4 py-1">Estado de envío</th>
                        <th className="px-4 py-1">Items</th>
                        <th className="px-4 py-1">Estado de pedido</th>
                        <th className="px-4 py-1">Tags</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-600 text-xs md:text-sm">
                    {orders.orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-100 transition text-xs">
                            
                            <td className="px-4 py-2 font-medium text-gray-900">
                                <Link href={`/admin/orders/${order._id}`} className="hover:text-blue-600">
                                    {order._id}
                                </Link>
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell">
                                {formatDate(order.createdAt)}
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell">
                                {order.user ? order.user.nombre : 'Anónimo'}
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell">
                                ${order.totalPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2">{order.paymentMethod}</td>
                            <td className="px-4 py-2">{order.shippingAddress.direccion}</td>
                            <td className="px-4 py-2">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </td>
                            <td className={`px-4 py-2 ${order.status === 'PENDIENTE' ? 'text-yellow-600' : order.status === 'ENVIADO' ? 'text-blue-600' : order.status === 'ENTREGADO' ? 'text-green-600' : 'text-red-600'}`}>
                                {order.status}
                            </td>
                            <td className="px-4 py-2">
                                {'todo:'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
