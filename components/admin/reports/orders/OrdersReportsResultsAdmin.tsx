
import RechardOrdersSales from "./RechardOrdersSales";
import DonutChartsOrders from "./DonutChartsOrders";
import PaymentMethodsChart from "./PaymentMethodsChart";
import SalesByRegionChart from "./SalesByRegionChart";
import KpiCardsOrders from "./KpiCardsOrders";

import { getOrdersOverTime, getSummaryOrders } from "@/src/services/orders";


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

    const dataRechardsOrders = await getOrdersOverTime({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    console.log("dataRechardsOrders", dataRechardsOrders);


    return (
        <div className="space-y-2">
            {/* Header */}
            <header className="flex justify-between items-center">
                <div>
                    <h3 className="mb-1 text-sm font-semibold text-gray-700">
                        Desde: {startDate ?? new Date().toLocaleDateString()} | Hasta:{" "}
                        {endDate ?? new Date().toLocaleDateString()}
                    </h3>
                </div>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {dataSummary && (
                    <KpiCardsOrders
                        kpis={dataSummary}
                    />
                )}
            </div>

            <div className="">
                <RechardOrdersSales
                    data={dataRechardsOrders}
                />
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
