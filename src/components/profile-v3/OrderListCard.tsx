// File: frontend/components/profile/orders/OrderListCard.tsx
import Link from "next/link";
import { Package, ArrowRight, Calendar, CreditCard } from "lucide-react";
import  OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import type { OrderResponse } from "@/src/schemas/order-v3.schema";

interface OrderListCardProps {
    order: OrderResponse;
}

export function OrderListCard({ order }: OrderListCardProps) {
    const date = new Date(order.createdAt).toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-border rounded-xl shadow-sm hover:border-zinc-300 transition-colors gap-4">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-foreground">
                        #{order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4" />
                        S/ {order.totalPrice.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        {totalItems} artículo{totalItems !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>
            <div className="pt-2 sm:pt-0 shrink-0">
                <Link
                    href={`/profile/orders/${order.orderNumber}`}
                    className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                >
                    Ver detalles
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}