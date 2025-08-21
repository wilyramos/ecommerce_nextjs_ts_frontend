import { getReportByVendors } from "@/src/services/sales";
import ChartsByVendors from "./ChertsByVendors";


interface SalesReportsResultsAdminProps {
    startDate?: string;
    endDate?: string;
}


export default async function ReportByVenderosAdmin({ startDate, endDate }: SalesReportsResultsAdminProps) {


    const topProducts = await getReportByVendors({
            fechaInicio: startDate,
            fechaFin: endDate,
        });

    if (!topProducts) {
        console.error("No se pudieron obtener los productos más vendidos.");
        return <p>No hay datos disponibles.</p>;
    }

    return (
        <>
            <ChartsByVendors data={topProducts.report} />
        </>
    );
}
