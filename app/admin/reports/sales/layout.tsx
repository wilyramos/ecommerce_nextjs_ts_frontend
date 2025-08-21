


import SalesButtonsFilter from "@/components/admin/reports/sales/SalesButtonsFilter";

export default function SalesReportLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col">
            <div>
                <SalesButtonsFilter />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
    );
}