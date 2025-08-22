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
import { formatCurrency } from "@/src/utils/formatCurrency";

const COLORS = ["#0077B6", "#00B4D8", "#90E0EF", "#48CAE4", "#5467C3", "#03045E"];

export default function ChartsByVendors({ data }: { data: VendorReport[] }) {
    return (
        <div className="space-y-6">
            {/* Donut + Lista */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Donut Chart */}
                <div className="md:col-span-2 bg-white p-4 rounded shadow flex flex-col items-center">
                    <h2 className="text-base font-semibold mb-4">Ventas por Vendedor</h2>
                    <div className="w-full h-72">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="totalSales"
                                    nameKey="nombre"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={3}
                                >
                                    {data.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={COLORS[i % COLORS.length]}
                                            className="hover:opacity-80 transition"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "12px" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lista Detalle */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-base font-semibold mb-4">Detalle de Vendedores</h2>
                    <ul>
                        {data.map((v, i) => (
                            <li key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                                <span>{v.nombre}</span>
                                <span className="font-semibold">{formatCurrency(v.totalSales)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Tabla Resumen */}
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-base font-semibold mb-4">Resumen de Ventas</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Vendedor</th>
                                <th className="px-3 py-2 text-right">Ventas</th>
                                <th className="px-3 py-2 text-right">Unidades</th>
                                <th className="px-3 py-2 text-right"># Ventas</th>
                                <th className="px-3 py-2 text-right">Margen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((v, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-3 py-2">{v.nombre}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(v.totalSales)}</td>
                                    <td className="px-3 py-2 text-right">{v.totalUnits}</td>
                                    <td className="px-3 py-2 text-right">{v.numSales}</td>
                                    <td className="px-3 py-2 text-right">{formatCurrency(v.margin)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
