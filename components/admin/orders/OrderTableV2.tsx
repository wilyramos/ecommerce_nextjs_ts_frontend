// File: components/admin/orders/OrderTableV2.tsx
"use client";

import Link from "next/link";
import { FiEye } from "react-icons/fi";
import type { OrderResponse } from "@/src/schemas/order.schema";

interface Props {
    orders: OrderResponse[];
}

export default function OrderTableV2({ orders }: Props) {
    if (orders.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-border rounded-[var(--radius-md)] bg-card">
                <p className="text-sm text-muted-foreground font-medium">No se encontraron órdenes con los filtros actuales.</p>
            </div>
        );
    }

    // Badge mapeador de estilos consistentes para los estados de la orden
    const getStatusStyles = (status: string) => {
        const base = "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none border w-fit ";
        switch (status) {
            case "awaiting_payment": return `${base} bg-amber-500/10 border-amber-500/20 text-amber-600`;
            case "processing":       return `${base} bg-blue-500/10 border-blue-500/20 text-blue-600`;
            case "shipped":          return `${base} bg-purple-500/10 border-purple-500/20 text-purple-600`;
            case "delivered":        return `${base} bg-emerald-500/10 border-emerald-500/20 text-emerald-600`;
            case "canceled":         return `${base} bg-destructive/10 border-destructive/20 text-destructive`;
            default:                 return `${base} bg-muted text-muted-foreground`;
        }
    };

    return (
        <div className="w-full overflow-x-auto border border-border rounded-[var(--radius-md)] bg-card">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-border bg-background-secondary text-[11px] font-bold uppercase text-muted-foreground tracking-wider select-none">
                        <th className="p-4">N° Orden</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Tipo</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                    {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-background-secondary/40 transition-colors">
                            <td className="p-4 font-bold text-foreground">{order.orderNumber}</td>
                            <td className="p-4 text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("es-PE", { dateStyle: "short" })}
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">
                                        {order.customerProfile.nombre} {order.customerProfile.apellidos}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">{order.customerProfile.email}</span>
                                </div>
                            </td>
                            <td className="p-4 select-none">
                                {order.user ? (
                                    <span className="text-[10px] bg-foreground text-background font-bold px-1.5 py-0.5 rounded-sm">REGISTRADO</span>
                                ) : (
                                    <span className="text-[10px] bg-muted text-muted-foreground font-bold px-1.5 py-0.5 rounded-sm border border-border">INVITADO</span>
                                )}
                            </td>
                            <td className="p-4 font-bold text-foreground">
                                {order.currency} {order.totalPrice.toFixed(2)}
                            </td>
                            <td className="p-4">
                                <div className={getStatusStyles(order.status)}>
                                    {order.status.replace("_", " ")}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <Link
                                    href={`/admin/orders-v2/${order._id}`}
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-border bg-card text-foreground hover:bg-background-secondary transition-colors"
                                >
                                    <FiEye size={14} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}