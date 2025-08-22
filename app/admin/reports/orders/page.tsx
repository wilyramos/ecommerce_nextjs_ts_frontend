import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import OrdersReportsResultsAdmin from '@/components/admin/reports/orders/OrdersReportsResultsAdmin';

type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function reportsOrdersPage({ searchParams }: SalesReportsPageProps) {

    const { startDate, endDate } = await searchParams;

    console.log("datte", startDate, endDate);

    return (
        <div>

            <Suspense fallback={<SpinnerLoading />}>
                <OrdersReportsResultsAdmin
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>
        </div>
    )
}