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
                <h2 className="text-sm text-muted-foreground">
                    No hay pedidos disponibles.
                </h2>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto pb-2">
            <Table className="min-w-full table-auto border-separate border-spacing-0">
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="p-1 text-center w-[90px] text-xs font-medium">
                            Pedido
                        </TableHead>
                        <TableHead className="p-1 text-center w-[110px] text-xs font-medium">
                            Fecha
                        </TableHead>
                        <TableHead className="p-1 text-center w-[120px] text-xs font-medium">
                            Pago
                        </TableHead>
                        <TableHead className="p-1 text-center w-[200px] text-xs font-medium">
                            Envío
                        </TableHead>
                        <TableHead className="p-1 text-center w-[90px] text-xs font-medium">
                            Estado
                        </TableHead>
                        <TableHead className="p-1 text-center w-[70px] text-xs font-medium">
                            Opciones
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order._id}
                            className="text-xs border-b hover:bg-muted/30 transition-colors"
                        >
                            <TableCell className="p-2 text-center font-semibold truncate">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="hover:underline"
                                >
                                    {order.orderNumber || order._id.slice(0, 8)}
                                </Link>
                            </TableCell>

                            <TableCell className="p-2 text-center text-muted-foreground truncate">
                                {formatDate(order.createdAt)}
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                <div className="flex flex-col items-center gap-1">
                                    <span className="font-medium">
                                        S/. {order.totalPrice.toFixed(2)}
                                    </span>
                                    <PaymentStatusBadge status={order.payment.status} />
                                </div>
                            </TableCell>

                            <TableCell className="p-2 text-center text-muted-foreground truncate">
                                {order.shippingAddress?.direccion},{" "}
                                {order.shippingAddress?.distrito}
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                <OrderStatusBadge status={order.status} />
                            </TableCell>

                            <TableCell className="p-2 text-center">
                                <Link
                                    href={`/admin/orders/${order._id}`}
                                    className="text-muted-foreground hover:text-foreground"
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
