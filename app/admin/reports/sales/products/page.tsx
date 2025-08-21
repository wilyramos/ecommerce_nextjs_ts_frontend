
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import SalesReportProductAdmin from '@/components/admin/reports/SalesReportProductAdmin';


type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function ProductsReportsSalesPage({searchParams}: SalesReportsPageProps) {

    const { startDate, endDate } = await searchParams;
    return (
        <div className="">
            {/* Resumen de métricas */}
            <Suspense fallback={<SpinnerLoading />}>
                <SalesReportProductAdmin
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>
        </div>
    )
}
