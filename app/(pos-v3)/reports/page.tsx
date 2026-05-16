import { Suspense } from "react";
import SalesReportsResultsAdmin from "@/components/admin/reports/SalesReportsResultsAdmin";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export default async function SalesGeneralPage({ searchParams }: { 
    searchParams: Promise<{ startDate?: string; endDate?: string }> 
}) {
    const { startDate, endDate } = await searchParams;
    return (
        <Suspense fallback={<SpinnerLoading />}>
            <SalesReportsResultsAdmin startDate={startDate} endDate={endDate} />
        </Suspense>
    );
}