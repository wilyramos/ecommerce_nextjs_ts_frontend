'use client';

import type { TOrder } from '@/src/schemas';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
// import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";


import {
    FaEye
} from 'react-icons/fa';

interface OrdersTableProps {
    orders: TOrder[];   
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="flex justify-center items-center">
                <h2 className="text-lg font-medium text-gray-500">No hay pedidos disponibles.</h2>
            </div>
        );
    }

    console.log(orders);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-white">
                    <tr className="text-gray-50 bg-blue-800">
                        <th className="px-6 py-1 text-left font-light">Pedido</th>
                        <th className="px-6 py-1 hidden md:table-cell font-light">Fecha</th>
                        <th className="px-6 py-1 hidden md:table-cell font-light">Pago</th>
                        <th className="px-6 py-1 hidden lg:table-cell font-light">Envío</th>
                        <th className="px-6 py-1 font-light">Estado</th>
                        <th className="px-6 py-1 text-center font-light">Opciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                    {orders.map((order) => (
                        <tr
                            key={order._id}
                            className="hover:bg-gray-200 transition-colors border-b border-gray-200"
                        >
                            <td className="px-6 py-4 max-w-[160px] truncate">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="text-black hover:underline font-semibold"
                                >
                                    {order.orderNumber || order._id.slice(0, 8)}
                                </Link>
                            </td>

                            <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                                {formatDate(order.createdAt)}
                            </td>

                            <td className=" text-xs  md:table-cell text-gray-800 ">
                                <div className='flex justify-between items-center gap-2'>
                                    <div>
                                        S/. {order.totalPrice.toFixed(2)}
                                    </div>
                                    <span>
                                        {order.payment.status}
                                    </span>
                                   
                                </div>
                            </td>



                            <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                                {order.shippingAddress?.direccion}, {order.shippingAddress?.distrito}
                            </td>

                            <td className="px-6 py-4">

                                <OrderStatusBadge status={order.status} />
                            </td>

                            <td className="px-6 py-4 text-center">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    title="Ver detalles"
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    <FaEye className="w-4 h-4" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}