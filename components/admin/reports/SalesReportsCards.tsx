import React from 'react';
import renderSummaryItem from './renderSummaryItem';
import { getSummarySales } from '@/src/services/sales';
import { FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi';
import { GoLinkExternal } from "react-icons/go";
import Link from 'next/link';

export default async function SalesReportsCards() {
    // Fechas: último mes
    const startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    const endDate: string = new Date().toISOString();

    const salesSummary = await getSummarySales({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    return (
        <section className="bg-white p-4 ">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-lg font-semibold text-gray-800">
                    Resumen de Ventas
                </h2>

                <div className="relative group self-start sm:self-auto">
                    <Link
                        href="/admin/reports/sales"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <GoLinkExternal size={18} />
                    </Link>

                    {/* Tooltip */}
                    <span className="absolute right-0 top-full mt-1 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        Ir a la vista general de ventas
                    </span>
                </div>
            </header>

            {/* Cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {renderSummaryItem("Ingresos totales", salesSummary?.totalSales || 0, <FiDollarSign />)}
                {renderSummaryItem("Ventas realizadas", salesSummary?.numberSales || 0, <FiPackage />)}
                {renderSummaryItem("Margen de ganancia", salesSummary?.margin || 0, <FiTrendingUp />)}
                {renderSummaryItem("Unidades vendidas", salesSummary?.totalUnitsSold || 0, <FiShoppingCart />)}
            </div>
        </section>
    );
}
