import FiltersReportsSales from '@/components/admin/reports/FiltersReportsSales';
import { HeadingH2 } from '@/components/ui/Heading';
import { FiDownload } from 'react-icons/fi';
import SalesReportsResultsAdmin from '@/components/admin/reports/SalesReportsResultsAdmin';
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';


type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function SalesReportsPage({ searchParams }: SalesReportsPageProps) {
    const { startDate, endDate } = await searchParams;

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
            <Suspense fallback={<SpinnerLoading />}>
                <SalesReportsResultsAdmin
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>
        </div>
    );
}
