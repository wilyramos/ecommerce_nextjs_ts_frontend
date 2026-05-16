import PosSalesFiltersReport from "@/src/components/reports/PosSalesFiltersReport";


export default function SalesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col ">
            <PosSalesFiltersReport />
            <main className="p-4 md:p-6">
                {children}
            </main>
        </div>
    );
}