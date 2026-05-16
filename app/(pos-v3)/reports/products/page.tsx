import { Suspense } from "react";
import SalesReportProductAdmin from "@/components/admin/reports/SalesReportProductAdmin";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export default async function SalesProductsPage({ searchParams }: { 
    searchParams: Promise<{ startDate?: string; endDate?: string }> 
}) {
    const { startDate, endDate } = await searchParams;
    return (
        <Suspense fallback={<SpinnerLoading />}>
            <SalesReportProductAdmin startDate={startDate} endDate={endDate} />
        </Suspense>
    );
}