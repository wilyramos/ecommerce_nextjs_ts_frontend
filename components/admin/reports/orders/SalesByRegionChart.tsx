"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import type { TOrdersByCity } from "@/src/schemas"

// 🎨 Paleta de colores suaves
const COLORS = {
    totalSales: "#60a5fa",     // azul medio
    numberOfOrders: "#93c5fd", // azul claro
}

export default function SalesByRegionPeruChart({ data }: { data: TOrdersByCity[] }) {
    const salesByCity = data.map((item) => ({
        region: item.department,
        totalSales: item.totalSales,
        numberOfOrders: item.numberOfOrders,
    }))

    return (
        <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Ventas por Región (Perú)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Distribución de ventas y órdenes en principales regiones del país
            </p>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={salesByCity}
                        margin={{ left: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="region"
                            tick={{ fontSize: 11, fill: "#6b7280" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                fontSize: "12px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />

                        {/* Barra para total de ventas */}
                        <Bar
                            dataKey="totalSales"
                            name="Ventas (S/.)"
                            fill={COLORS.totalSales}
                            radius={[0, 6, 6, 0]}
                        />

                        {/* Barra para número de órdenes */}
                        <Bar
                            dataKey="numberOfOrders"
                            name="Órdenes"
                            fill={COLORS.numberOfOrders}
                            radius={[0, 6, 6, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
