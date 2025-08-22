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

import { Cell } from "recharts"
const paymentMethods = [
    { name: "Tarjeta", value: 220 },
    { name: "PayPal", value: 140 },
    { name: "Transferencia", value: 60 },
    { name: "Contraentrega", value: 40 },
]

// 🎨 Colores suaves consistentes
const COLORS = ["#93c5fd", "#bae6fd", "#60a5fa", "#7dd3fc"]

export default function PaymentMethodsChart() {
    return (
        <div className="p-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Métodos de Pago
            </h3>
            <p className="text-xs text-gray-400 mb-4">
                Distribución de órdenes por método de pago
            </p>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={paymentMethods}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100" />
                        <XAxis
                            dataKey="name"
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
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 0, 0]}
                        >
                            {paymentMethods.map((_, index) => (
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
