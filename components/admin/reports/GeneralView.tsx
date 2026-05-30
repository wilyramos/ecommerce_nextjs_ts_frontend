// File: frontend/components/admin/reports/GeneralView.tsx

import { H2 } from "@/components/ui/Typography";
import Link from "next/link";
import { GoLinkExternal } from "react-icons/go";
import renderSummaryItem from "./renderSummaryItem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function GeneralView() {
    const salesSummary = {
        totalSales: 10000,
        numberSales: 150,
        margin: 20,
        totalUnitsSold: 300
    };

    return (
        <section className="space-y-4">
            <header className="flex items-center justify-between border-b border-border pb-2 select-none">
                <H2>Detalle de Órdenes</H2>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/reports/orders"
                                className="p-2 text-muted-foreground hover:text-action-cta bg-background-secondary rounded-[var(--radius-sm)] transition-colors focus-visible:outline-hidden"
                            >
                                <GoLinkExternal size={16} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ir a la vista general de pedidos</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </header>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {renderSummaryItem("Ingresos totales", salesSummary?.totalSales || 0)}
                {renderSummaryItem("Ventas realizadas", salesSummary?.numberSales || 0)}
                {renderSummaryItem("Margen de ganancia", salesSummary?.margin || 0)}
                {renderSummaryItem("Unidades vendidas", salesSummary?.totalUnitsSold || 0)}
            </div>
        </section>
    )
}