"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const estadosOrdenes = [
    { name: "Entregado", value: 180 },
    { name: "Procesando", value: 90 },
    { name: "Enviado", value: 30 },
    { name: "Cancelado", value: 20 },
]

// 🎨 Colores suaves (azules y celestes pastel)
const COLORS = ["#93c5fd", "#bae6fd", "#60a5fa", "#7dd3fc"]

export default function DonutChartsOrders() {
    return (
        <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Órdenes por Estado
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Distribución de órdenes según estado
            </p>
            <div className="h-72">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={estadosOrdenes}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={3}
                            cornerRadius={6}
                        >
                            {estadosOrdenes.map((_, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="#fff"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                fontSize: "12px",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: "12px" }}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
