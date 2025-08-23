"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { TOrdersByStatus } from "@/src/schemas";

// 🎨 Paleta corporativa (azules, grises y un celeste de acento)
const COLORS = ["#1E40AF", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#64748B"];

export default function DonutChartsOrders({ data }: { data: TOrdersByStatus[] }) {
    // 🔄 Adaptar los datos para Recharts
    const estadosOrdenes = (data || []).map((item) => ({
        name: traducirEstado(item.status), // etiqueta legible
        value: item.numberOfOrders, // valor numérico
    }));

    return (
        <div className="p-4 bg-white ">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Órdenes por Estado
            </h3>
            <p className="text-xs text-gray-500 mb-4">
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
                            innerRadius={55}
                            outerRadius={95}
                            paddingAngle={4}
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
                                backgroundColor: "#f9fafb",
                                color: "#111827",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
    );
}

// 📝 Función auxiliar para mostrar estados en español legible
function traducirEstado(status: string) {
    const map: Record<string, string> = {
        awaiting_payment: "En espera de pago",
        processing: "Procesando",
        shipped: "Enviado",
        delivered: "Entregado",
        canceled: "Cancelado",
        paid_but_out_of_stock: "Pagado sin stock",
    };
    return map[status] || status;
}
