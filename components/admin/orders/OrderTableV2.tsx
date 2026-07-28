// File: components/admin/orders/OrderTableV2.tsx
"use client";

import Link from "next/link";
import { Eye, Package, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    type OrderResponse,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS_LABELS
} from "@/src/schemas/order.schema";

interface Props {
    orders: OrderResponse[];
}

export default function OrderTableV2({ orders }: Props) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-16 px-4 border border-dashed border-border rounded-lg bg-card">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">No se encontraron órdenes</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Intenta ajustar los criterios de búsqueda o limpia los filtros activos.
                </p>
            </div>
        );
    }

    // Helper para mapear exclusivamente a las VARIANTES del Badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "awaiting_payment":
                return <Badge variant="warning">{ORDER_STATUS_LABELS.awaiting_payment}</Badge>;
            case "processing":
                return <Badge variant="info">{ORDER_STATUS_LABELS.processing}</Badge>;
            case "shipped":
                return <Badge variant="purple">{ORDER_STATUS_LABELS.shipped}</Badge>;
            case "delivered":
                return <Badge variant="success">{ORDER_STATUS_LABELS.delivered}</Badge>;
            case "canceled":
                return <Badge variant="rose">{ORDER_STATUS_LABELS.canceled}</Badge>;
            case "paid_but_out_of_stock":
                return <Badge variant="orange">{ORDER_STATUS_LABELS.paid_but_out_of_stock}</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    // Helper para mapear el pago usando variantes reutilizables
    const getPaymentBadge = (paymentStatus?: string) => {
        if (!paymentStatus) {
            return <Badge variant="neutral">Sin Pago</Badge>;
        }
        switch (paymentStatus) {
            case "approved":
                return <Badge variant="solid-success">{PAYMENT_STATUS_LABELS.approved}</Badge>;
            case "pending":
                return <Badge variant="warning">{PAYMENT_STATUS_LABELS.pending}</Badge>;
            case "refunded":
                return <Badge variant="purple">{PAYMENT_STATUS_LABELS.refunded}</Badge>;
            case "rejected":
                return <Badge variant="destructive">{PAYMENT_STATUS_LABELS.rejected}</Badge>;
            default:
                return <Badge variant="neutral">{paymentStatus}</Badge>;
        }
    };

    const formatMoney = (amount: number, currency: string = "PEN") => {
        return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(amount);
    };

    return (
        <div className="w-full overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="text-[11px] uppercase tracking-wider">
                        <TableHead className="font-bold py-3.5">N° Orden</TableHead>
                        <TableHead className="font-bold py-3.5">Fecha</TableHead>
                        <TableHead className="font-bold py-3.5">Cliente</TableHead>
                        <TableHead className="font-bold py-3.5">Productos</TableHead>
                        <TableHead className="font-bold py-3.5">Estado Pago</TableHead>
                        <TableHead className="font-bold py-3.5">Estado Logístico</TableHead>
                        <TableHead className="font-bold py-3.5">Total</TableHead>
                        <TableHead className="font-bold py-3.5 text-right">Acción</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                    {orders.map((order) => {
                        const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);
                        const initials = `${order.customerProfile.nombre?.[0] || ""}${order.customerProfile.apellidos?.[0] || ""}`.toUpperCase();

                        return (
                            <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                                
                                {/* Número de Orden */}
                                <TableCell className="font-bold text-foreground py-3">
                                    <Link 
                                        href={`/admin/orders-v2/${order._id}`}
                                        className="hover:underline text-primary"
                                    >
                                        {order.orderNumber}
                                    </Link>
                                </TableCell>

                                {/* Fecha */}
                                <TableCell className="text-muted-foreground whitespace-nowrap">
                                    {new Date(order.createdAt).toLocaleDateString("es-PE", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </TableCell>

                                {/* Cliente */}
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                      
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-medium text-foreground truncate max-w-[160px]">
                                                {order.customerProfile.nombre} {order.customerProfile.apellidos}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                                                {order.customerProfile.email}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Unidades Compradas */}
                                <TableCell className="whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 font-medium text-muted-foreground">
                                        <ShoppingBag className="w-3 h-3" />
                                        {totalUnits} {totalUnits === 1 ? "unidad" : "unidades"}
                                    </span>
                                </TableCell>

                                {/* Estado de Pago (Variante sin clases adicionales) */}
                                <TableCell className="whitespace-nowrap">
                                    {getPaymentBadge(order.payment?.status)}
                                </TableCell>

                                {/* Estado Logístico (Variante sin clases adicionales) */}
                                <TableCell className="whitespace-nowrap">
                                    {getStatusBadge(order.status)}
                                </TableCell>

                                {/* Total Mapeado */}
                                <TableCell className="font-bold text-foreground whitespace-nowrap">
                                    {formatMoney(order.totalPrice, order.currency)}
                                </TableCell>

                                {/* Botón de Ver Detalle */}
                                <TableCell className="text-right whitespace-nowrap">
                                    <Button 
                                        asChild 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        <Link href={`/admin/orders-v2/${order._id}`}>
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </TableCell>

                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}