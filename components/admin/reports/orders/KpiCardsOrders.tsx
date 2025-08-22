import React from 'react'
import KpiCard from '@/components/ui/admin/KpiCard'



const kpis = {
    ventasTotales: 45200,
    ordenesTotales: 320,
    ticketPromedio: 141.25,
    ordenesCanceladas: 20,
};

export default function KpiCardsOrders() {
    return (
        <>
            <KpiCard
                title="Ventas Totales"
                value={`S/ ${kpis.ventasTotales.toLocaleString()}`}
            />
            <KpiCard
                title="Órdenes Totales"
                value={kpis.ordenesTotales}
            />
            <KpiCard
                title="Ticket Promedio"
                value={`S/ ${kpis.ticketPromedio}`}
            />
            <KpiCard
                title="Órdenes Canceladas"
                value={kpis.ordenesCanceladas}
            />
        </>
    )
}
