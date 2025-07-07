'use client';

import type { OrdersList } from '@/src/schemas';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";


import {
    FaEye
} from 'react-icons/fa';

interface OrdersTableProps {
    orders: OrdersList;
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    if (!orders || orders.orders.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <h2 className="text-lg font-medium text-gray-500">No hay pedidos disponibles.</h2>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-white">
                    <tr className="text-gray-600 font-semibold">
                        <th className="px-6 py-4 text-left">Pedido</th>
                        <th className="px-6 py-4 hidden md:table-cell">Fecha</th>
                        <th className="px-6 py-4 hidden md:table-cell">Total</th>
                        <th className="px-6 py-4">Pago</th>
                        <th className="px-6 py-4 hidden lg:table-cell">Envío</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-center">Ver</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-50 divide-y divide-gray-100 text-gray-800">
                    {orders.orders.map((order) => (
                        <tr
                            key={order._id}
                            className="hover:bg-white transition-colors"
                        >
                            <td className="px-6 py-4 max-w-[160px] truncate">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    #{order._id.slice(-6).toUpperCase()}
                                </Link>
                            </td>

                            <td className="px-6 py-4 hidden md:table-cell text-gray-500">
                                {formatDate(order.createdAt)}
                            </td>

                            <td className="px-6 py-4 hidden md:table-cell font-semibold text-gray-800">
                                S/. {order.totalPrice.toFixed(2)}
                            </td>

                            <td className="px-6 py-4">
                                <PaymentStatusBadge status={order.paymentStatus} />
                            </td>

                            <td className="px-6 py-4 hidden lg:table-cell text-gray-500">
                                {order.shippingAddress?.direccion}, {order.shippingAddress?.distrito}
                            </td>

                            <td className="px-6 py-4">{order.items.length}</td>

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