import { Suspense } from "react";
import ReportByVenderosAdmin from "@/components/admin/reports/ReportByVenderosAdmin";
import SpinnerLoading from "@/components/ui/SpinnerLoading";

export default async function SalesVendorsPage({ searchParams }: {
    searchParams: Promise<{ startDate?: string; endDate?: string }>
}) {
    const { startDate, endDate } = await searchParams;
    return (
        <Suspense fallback={<SpinnerLoading />}>
            <ReportByVenderosAdmin startDate={startDate} endDate={endDate} />
        </Suspense>
    );
}