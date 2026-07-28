// File: components/admin/orders/OrderStatsCards.tsx

import { type OrderShopifyStats } from "@/src/schemas/order.schema";
import { formatPrice, cn } from "@/lib/utils";

interface Props {
    stats: OrderShopifyStats;
    className?: string;
}

export default function OrderStatsCards({ stats, className }: Props) {
    return (
        <div className={cn("rounded-lg border border-border bg-card p-4 mb-6", className)}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-border">
                
                {/* 1. Órdenes Pagadas */}
                <div className="flex flex-col px-4 py-2 first:pl-0">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Órdenes Pagadas
                    </span>
                    <span className="text-2xl font-bold text-foreground mt-1">
                        {stats.paidOrders}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Pagos confirmados</span>
                </div>

                {/* 2. Stock Descontado */}
                <div className="flex flex-col px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Items Descontados
                    </span>
                    <span className="text-2xl font-bold text-foreground mt-1">
                        {stats.itemsDiscounted}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Unidades fuera de stock</span>
                </div>

                {/* 3. Ingresos Recaudados (Usando formatPrice) */}
                <div className="flex flex-col px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Ingresos Cobrados
                    </span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                        {formatPrice(stats.paidRevenue)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Ventas efectivas</span>
                </div>

                {/* 4. Pendientes de Despacho */}
                <div className="flex flex-col px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Por Despachar
                    </span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                        {stats.pendingFulfillment}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Pagados en preparación</span>
                </div>

                {/* 5. Reversiones por Reembolso (Usando formatPrice) */}
                <div className="flex flex-col px-4 py-2 last:pr-0">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Reembolsos
                    </span>
                    <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 font-mono">
                        {formatPrice(stats.salesReversals)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Stock restituido</span>
                </div>

            </div>
        </div>
    );
}