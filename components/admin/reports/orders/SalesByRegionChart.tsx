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
    Cell,
} from "recharts"

const salesByRegionPeru = [
    { region: "Lima", value: 850 },
    { region: "La Libertad", value: 320 },
    { region: "Loreto", value: 210 },
    { region: "Arequipa", value: 400 },
    { region: "Cusco", value: 280 },
    { region: "Piura", value: 350 },
    { region: "Puno", value: 150 },
]

// 🎨 Paleta de colores suaves
const COLORS = ["#93c5fd", "#bae6fd", "#60a5fa", "#7dd3fc", "#bfdbfe", "#a5f3fc", "#38bdf8"]

export default function SalesByRegionPeruChart() {
    return (
        <div className="p-4 ">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Ventas por Región (Perú)
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Distribución de ventas en principales regiones del país
            </p>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={salesByRegionPeru}
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
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {salesByRegionPeru.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
