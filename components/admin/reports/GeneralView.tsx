import { HeadingH3 } from "@/components/ui/Heading";
import Link from "next/link";
import { GoLinkExternal } from "react-icons/go";
import renderSummaryItem from "./renderSummaryItem";


export default function GeneralView() {

    // const startDate: string = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString();
    // const endDate: string = new Date().toISOString();

    const salesSummary = {
        totalSales: 10000,
        numberSales: 150,
        margin: 20,
        totalUnitsSold: 300
    };

    return (
        <div className="p-4">

            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <HeadingH3>Detalle de Ordenes</HeadingH3>


                <div className="relative group self-start sm:self-auto">
                    <Link
                        href="/admin/reports/orders"
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <GoLinkExternal size={18} />
                    </Link>

                    {/* Tooltip */}
                    <span className="absolute right-0 top-full mt-1 w-max px-2 py-1 text-xs text-white bg-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        Ir a la vista general de pedidos
                    </span>
                </div>
            </header>


            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {renderSummaryItem("Ingresos totales", salesSummary?.totalSales || 0)}
                {renderSummaryItem("Ventas realizadas", salesSummary?.numberSales || 0)}
                {renderSummaryItem("Margen de ganancia", salesSummary?.margin || 0)}
                {renderSummaryItem("Unidades vendidas", salesSummary?.totalUnitsSold || 0)}
            </div>
        </div>
    )
}
