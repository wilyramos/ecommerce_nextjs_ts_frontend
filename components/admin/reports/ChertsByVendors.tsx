"use client";

import { VendorReport } from "@/src/services/sales";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#f43f5e"];

export default function ChartsByVendors({ data }: { data: VendorReport[] }) {
    return (
        <div className="grid grid-cols-2 gap-8">
            {/* Gráfico en pastel */}
            <div className="p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-6 text-gray-800">
                    Ventas por Vendedor
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="totalSales"
                            nameKey="nombre"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="transition-opacity hover:opacity-80"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Lista de vendedores */}
            <div className="bg-white p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Lista de Vendedores
                </h2>
                <ul className="divide-y divide-gray-100">
                    {data.map((vendor, i) => (
                        <li
                            key={i}
                            className="flex justify-between py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg px-2 transition"
                        >
                            <span className="font-medium text-gray-800">{vendor.nombre}</span>
                            <span className="font-semibold text-gray-900">
                                ${vendor.totalSales.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tabla completa */}
            <div className="col-span-2 mt-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                    Detalle en Tabla
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700 text-sm">
                                <th className="px-4 py-3 font-medium">Vendedor</th>
                                <th className="px-4 py-3 font-medium text-right">Ventas Totales</th>
                                <th className="px-4 py-3 font-medium text-right">Unidades</th>
                                <th className="px-4 py-3 font-medium text-right"># Ventas</th>
                                <th className="px-4 py-3 font-medium text-right">Margen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((vendor, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3 text-gray-800">{vendor.nombre}</td>
                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                        ${vendor.totalSales.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right">{vendor.totalUnits}</td>
                                    <td className="px-4 py-3 text-right">{vendor.numSales}</td>
                                    <td className="px-4 py-3 text-right">${vendor.margin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
