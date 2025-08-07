import ChartsSales from '@/components/admin/reports/ChartsSales';
import FiltersReportsSales from '@/components/admin/reports/FiltersReportsSales';
import { HeadingH2 } from '@/components/ui/Heading';
import React from 'react';
import { FiDownload, FiDollarSign, FiTrendingUp, FiPackage, FiShoppingCart } from 'react-icons/fi';

type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function SalesReportsPage({ searchParams }: SalesReportsPageProps) {
    const { startDate, endDate } = await searchParams;

    const dateRange = startDate && endDate ? {
        from: new Date(startDate),
        to: new Date(endDate),
    } : undefined;

    // Datos demo
    const demoData = [
        { name: "Ene", ventas: 400 },
        { name: "Feb", ventas: 300 },
        { name: "Mar", ventas: 500 },
        { name: "Abr", ventas: 200 },
        { name: "May", ventas: 600 },
        { name: "Jun", ventas: 350 },
    ];

    // Calcular métricas demo
    const totalVentas = demoData.reduce((acc, item) => acc + item.ventas, 0);
    const margen = totalVentas * 0.3; // 30% margen estimado
    const unidadesVendidas = demoData.length * 25; // ejemplo: 25 unidades promedio por mes
    const numeroVentas = demoData.length * 10; // ejemplo: 10 transacciones por mes

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <HeadingH2>Vista general de ventas</HeadingH2>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <FiDownload className="text-lg" />
                </button>
            </div>

            {/* Filtros */}
            <div className="p-2">
                <FiltersReportsSales />
            </div>

            {/* Resumen de métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-2">
                <div className="border p-4 rounded-lg bg-white shadow-sm flex items-center gap-3">
                    <FiDollarSign className="text-blue-600 text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Ventas totales</div>
                        <div className="text-sm font-semibold">S/. {totalVentas}</div>
                    </div>
                </div>
                <div className="border p-4 rounded-lg bg-white shadow-sm flex items-center gap-3">
                    <FiTrendingUp className="text-green-600 text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Margen estimado</div>
                        <div className="text-sm font-semibold">S/. {margen.toFixed(2)}</div>
                    </div>
                </div>
                <div className="border p-4 rounded-lg bg-white shadow-sm flex items-center gap-3">
                    <FiPackage className="text-purple-600 text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Unidades vendidas</div>
                        <div className="text-sm font-semibold">{unidadesVendidas}</div>
                    </div>
                </div>
                <div className="border p-4 rounded-lg bg-white shadow-sm flex items-center gap-3">
                    <FiShoppingCart className="text-orange-600 text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Número de ventas</div>
                        <div className="text-sm font-semibold">{numeroVentas}</div>
                    </div>
                </div>
            </div>

            {/* Gráfico */}
            <div className="p-2">
                <ChartsSales data={demoData} dateRange={dateRange} />
            </div>
        </div>
    );
}
