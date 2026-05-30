// File: frontend/components/admin/reports/SalesReportsCards.tsx

import renderSummaryItem from './renderSummaryItem';
import { getSummarySales } from '@/src/services/sales';
import { FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { GoLinkExternal } from "react-icons/go";
import Link from 'next/link';
import { H2 } from '@/components/ui/Typography';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default async function SalesReportsCards() {
    const startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    const endDate: string = new Date().toISOString();

    const startDateFormatted = startDate.split("T")[0];
    const endDateFormatted = endDate.split("T")[0];

    const salesSummary = await getSummarySales({
        fechaInicio: startDateFormatted,
        fechaFin: endDateFormatted,
    });

    return (
        <section className="space-y-4">
            <header className="flex items-center justify-between border-b border-border pb-2 select-none">
                <H2>Resumen de Ventas</H2>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/admin/reports/sales"
                                className="p-2 text-muted-foreground hover:text-action-cta bg-background-secondary rounded-[var(--radius-sm)] transition-colors focus-visible:outline-hidden"
                            >
                                <GoLinkExternal size={16} />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ir a la vista general de ventas</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </header>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {renderSummaryItem("Ingresos totales", salesSummary?.totalSales || 0, <FiDollarSign />)}
                {renderSummaryItem("Ventas realizadas", salesSummary?.numberSales || 0, <FiPackage />)}
                {renderSummaryItem("Margen de ganancia", salesSummary?.margin || 0, <FiTrendingUp />)}
                {renderSummaryItem("Unidades vendidas", salesSummary?.totalUnitsSold || 0, <FiShoppingCart />)}
            </div>
        </section>
    );
}