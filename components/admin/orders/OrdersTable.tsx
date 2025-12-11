"use client";

import type { TOrder } from "@/src/schemas";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import PaymentStatusBadge from "@/components/ui/PaymentStatusBadge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { FaEye } from "react-icons/fa";

interface OrdersTableProps {
    orders: TOrder[];
}

export default function OrdersTable({ orders }: OrdersTableProps) {
    if (!orders || orders.length === 0) {
        return (
            <div className="flex justify-center items-center py-10">
                <h2 className="text-lg font-medium text-gray-500">
                    No hay pedidos disponibles.
                </h2>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Table className="w-full table-fixed">
                <TableHeader>
                    <TableRow className="text-gray-100 bg-blue-100">
                        <TableHead className="px-4 py-2 w-[90px] font-medium text-xs sm:text-sm">Pedido</TableHead>
                        <TableHead className="px-4 py-2 w-[110px] font-medium text-xs sm:text-sm">Fecha</TableHead>
                        <TableHead className="px-4 py-2 w-[120px] font-medium text-xs sm:text-sm">Pago</TableHead>
                        <TableHead className="px-4 py-2  w-[200px] font-medium text-xs sm:text-sm">Envío</TableHead>
                        <TableHead className="px-4 py-2 w-[90px] font-medium text-xs sm:text-sm">Estado</TableHead>
                        <TableHead className="px-4 py-2 text-center w-[70px] font-medium text-xs sm:text-sm">Opciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order._id}
                            className="hover:bg-gray-100 border-b border-gray-200 transition-colors text-[11px] sm:text-sm"
                        >
                            <TableCell className="px-4 py-3 truncate font-semibold">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="text-gray-900 hover:underline"
                                >
                                    {order.orderNumber || order._id.slice(0, 8)}
                                </Link>
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-500 truncate">
                                {formatDate(order.createdAt)}
                            </TableCell>

                            <TableCell className="px-4 py-3 text-gray-800">
                                <div className="flex flex-col items-start gap-1">
                                    <span className="font-medium">S/. {order.totalPrice.toFixed(2)}</span>
                                    <PaymentStatusBadge status={order.payment.status} />
                                </div>
                            </TableCell>

                            <TableCell className="px-4 py-3  text-gray-500 truncate">
                                {order.shippingAddress?.direccion},
                                {" "}
                                {order.shippingAddress?.distrito}
                            </TableCell>

                            <TableCell className="px-4 py-3">
                                <OrderStatusBadge status={order.status} />
                            </TableCell>

                            <TableCell className="px-4 py-3 text-center">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <FaEye className="w-4 h-4" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
