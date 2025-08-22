"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
} from "recharts"

//DATA EXAMPLE
const ordersData = [
    { date: "2024-08-01", orders: 25, total: 1250 },
    { date: "2024-08-02", orders: 30, total: 1500 },
    { date: "2024-08-03", orders: 18, total: 900 },
    { date: "2024-08-04", orders: 42, total: 2100 },
    { date: "2024-08-05", orders: 35, total: 1750 },
    { date: "2024-08-06", orders: 28, total: 1400 },
    { date: "2024-08-07", orders: 40, total: 2000 },
]

export default function OrdersReportChart() {
    return (
        <div className="w-full">
            <h3 className="mb-1 text-sm font-semibold text-gray-700">
                Reporte de Órdenes
            </h3>
            <p className="mb-4 text-xs text-gray-400">
                Número de órdenes y suma total (últimos 7 días)
            </p>
            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ordersData}>
                        <defs>
                            {/* Azul pastel más suave */}
                            <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
                            </linearGradient>

                            {/* Celeste muy claro */}
                            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#bae6fd" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#bae6fd" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#9ca3af" }}
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
                        <Legend wrapperStyle={{ fontSize: "12px", color: "#6b7280" }} />

                        {/* Línea azul pastel */}
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#60a5fa"
                            strokeWidth={1.2}
                            fillOpacity={1}
                            fill="url(#orders)"
                            name="Órdenes"
                        />

                        {/* Línea celeste clara */}
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#7dd3fc"
                            strokeWidth={1.2}
                            fillOpacity={1}
                            fill="url(#total)"
                            name="Total ($)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
