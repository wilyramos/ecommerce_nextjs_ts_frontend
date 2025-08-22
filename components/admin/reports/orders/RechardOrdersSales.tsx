"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts"
import type { TOrdersOverTime } from "@/src/schemas"

export default function OrdersReportChart(
    { data }: { data?: TOrdersOverTime[] }
) {
    // Normalizamos para que el gráfico use nombres simples
    const normalizedData = data?.map(item => ({
        date: item.date,
        orders: item.numberOfOrders,
        total: item.totalSales
    })) ?? []

    return (
        <div className="w-full">
            <h3 className="mb-1 text-sm font-semibold text-gray-700">
                Reporte de Órdenes
            </h3>
            <p className="mb-4 text-xs text-gray-400">
                Número de órdenes y suma total
            </p>
            <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={normalizedData}>
                        <defs>
                            <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
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
                            formatter={(value, name) =>
                                name === "Órdenes"
                                    ? [`${value}`, "Órdenes"]
                                    : [`S/ ${value}`, "Total"]
                            }
                            contentStyle={{
                                fontSize: "12px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#60a5fa"
                            strokeWidth={1.2}
                            fillOpacity={1}
                            fill="url(#orders)"
                            name="Órdenes"
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#7dd3fc"
                            strokeWidth={1.2}
                            fillOpacity={1}
                            fill="url(#total)"
                            name="Total (S/.)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
