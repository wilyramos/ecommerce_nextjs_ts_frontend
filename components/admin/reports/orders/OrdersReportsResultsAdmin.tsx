
import RechardOrdersSales from "./RechardOrdersSales";
import DonutChartsOrders from "./DonutChartsOrders";
import PaymentMethodsChart from "./PaymentMethodsChart";
import SalesByRegionChart from "./SalesByRegionChart";
import KpiCardsOrders from "./KpiCardsOrders";

import { getSummaryOrders } from "@/src/services/orders";


type OrdersReportsResultsAdminProps = {
    startDate?: string;
    endDate?: string;
};

export default async function OrdersReportsResultsAdmin({
    startDate,
    endDate,
}: OrdersReportsResultsAdminProps) {


     const dataSummary = await getSummaryOrders({
            fechaInicio: startDate,
            fechaFin: endDate,
        });

    console.log("Sales summary:", dataSummary);



    return (
        <div className="space-y-4">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">
                        Desde: {startDate ?? "01/08/2025"} | Hasta:{" "}
                        {endDate ?? "05/08/2025"}
                    </p>
                </div>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {dataSummary && (
                    <KpiCardsOrders
                        kpis={dataSummary}
                    />
                )}
            </div>

            <div>
                <RechardOrdersSales />
            </div>

            {/* GRID 3 CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pie chart */}

                <div>
                    <DonutChartsOrders />
                </div>

                {/* Bar chart métodos de pago */}
                <div className="">
                    <PaymentMethodsChart />
                </div>

                {/* Bar chart regiones */}
                <div className="">
                    <SalesByRegionChart />
                </div>
            </div>
        </div>
    );
}
