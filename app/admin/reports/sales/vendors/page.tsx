import SpinnerLoading from "@/components/ui/SpinnerLoading";
import { Suspense } from "react";
import ReportByVenderosAdmin from "@/components/admin/reports/ReportByVenderosAdmin";


type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function VendorsPage({ searchParams }: SalesReportsPageProps) {

    const { startDate, endDate } = await searchParams;

    return (
        <div className="">
            <Suspense fallback={<SpinnerLoading />}>
                <ReportByVenderosAdmin
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>

        </div>
    )
}
