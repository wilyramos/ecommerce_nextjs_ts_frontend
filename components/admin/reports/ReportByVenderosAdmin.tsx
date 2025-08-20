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
        return <p>Error al cargar los productos más vendidos.</p>;
    }

    console.log("Top products by vendor:", topProducts);

    return (
        <>
            <ChartsByVendors data={topProducts.report} />
        </>
    );
}
