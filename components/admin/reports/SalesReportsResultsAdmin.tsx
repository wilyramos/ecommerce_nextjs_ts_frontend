import { getMetricsSales, getSummarySales } from "@/src/services/sales";
import ChartsSales from "./ChartsSales";
import renderSummaryItem from "./renderSummaryItem";
import { FiDollarSign, FiTrendingUp, FiPackage, FiShoppingCart } from "react-icons/fi";


interface SalesReportsResultsAdminProps {
    startDate?: string;
    endDate?: string;
}

export default async function SalesReportsResultsAdmin({ startDate, endDate }: SalesReportsResultsAdminProps) {

    const salesSummary = await getSummarySales({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    const data = await getMetricsSales({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    console.log("Sales data:", data);

  

    return (
        <>
            <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {renderSummaryItem("Suma de ventas", salesSummary?.totalSales || 0, <FiDollarSign />)}
                    {renderSummaryItem("Numero de ventas", salesSummary?.numberSales || 0, <FiPackage />)}
                    {renderSummaryItem("Margen", salesSummary?.margin || 0, <FiTrendingUp />)}
                    {renderSummaryItem("Total unidades", salesSummary?.totalUnitsSold || 0, <FiShoppingCart />)}

                </div>

            </div>

            { data ? <ChartsSales data={data} /> : <p>No hay datos disponibles para mostrar.</p>}
        </>
    )
}
