import { getTopProducts } from "@/src/services/sales";
import ChartsProducts from "./ChartsProducts";

interface SalesReportsResultsAdminProps {
    startDate?: string;
    endDate?: string;
}




export default async function SalesReportProductAdmin({ startDate, endDate }: SalesReportsResultsAdminProps) {

    const topProducts = await getTopProducts(
        {
            fechaInicio: startDate,
            fechaFin: endDate,
        }
    );

    if (!topProducts) {
        console.error("No se pudieron obtener los productos más vendidos.");
        return <p>Error al cargar los productos más vendidos.</p>;
    }

    return (
        <div>

            <ChartsProducts data={topProducts} />

        </div>
    )
}
