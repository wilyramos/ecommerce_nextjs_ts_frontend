import { TOrdersSummary } from "@/src/schemas"
import KpiCard from "@/components/ui/admin/KpiCard"

const KPI_LABELS: Record<string, string> = {
    grossSales: "Ventas Brutas",
    netSales: "Ventas Netas",
    numberOrders: "Órdenes Totales",
    numberOrdersPagadas: "Órdenes Pagadas",
    numberOrdersPendientes: "Órdenes Pendientes",
    numberOrdersCanceladas: "Órdenes Canceladas",
    totalUnitsSold: "Unidades Vendidas",
    margin: "Margen",
    marginRate: "Margen %",
    avgPaidOrderValue: "Ticket Promedio Pagado"
};


export default function KpiCardsOrders({ kpis }: { kpis: TOrdersSummary }) {
    return (
        <>
            {Object.entries(kpis).map(([key, value]) => (
                <KpiCard
                    key={key}
                    title={KPI_LABELS[key] || key}  // usar label si existe
                    value={typeof value === "number" ? value.toLocaleString("es-PE") : value}
                />
            ))}
        </>
    )
}