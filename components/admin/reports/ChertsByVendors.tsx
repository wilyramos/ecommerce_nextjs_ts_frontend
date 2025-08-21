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

// A more modern and professional color palette
const COLORS = [
    "#0077B6", // Dark Blue
    "#00B4D8", // Cyan
    "#90E0EF", // Light Cyan
    "#48CAE4", // Medium Cyan
    "#5467C3", // Another Blue
    "#03045E", // Darker Blue
];

// Custom Tooltip for a cleaner look
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 text-xs shadow-md rounded-lg">
                <p className="font-semibold text-gray-800">{payload[0].name}</p>
                <p className="text-gray-600">
                    Ventas: {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export default function ChartsByVendors({ data }: { data: VendorReport[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pie Chart and Summary List */}
            <div className="md:col-span-1 lg:col-span-2 rounded-lg bg-white p-4 flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold mb-4 text-gray-900">
                    Ventas por Vendedor
                </h2>
                <div className="flex flex-col lg:flex-row items-center justify-center w-full">
                    <div className="w-full lg:w-2/3 h-64 lg:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="totalSales"
                                    nameKey="nombre"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    labelLine={false}
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="transition-opacity duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    layout="vertical"
                                    verticalAlign="middle"
                                    align="right"
                                    wrapperStyle={{ fontSize: "12px", paddingLeft: "20px" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Vendor Details List */}
            <div className="md:col-span-1 lg:col-span-1 rounded-lg bg-white p-4">
                <h2 className="text-lg font-bold mb-4 text-gray-900">
                    Detalle de Vendedores
                </h2>
                <ul className="divide-y divide-gray-100">
                    {data.map((vendor, i) => (
                        <li
                            key={i}
                            className="flex justify-between py-2 text-xs transition hover:bg-gray-50"
                        >
                            <span className="font-medium text-gray-700">{vendor.nombre}</span>
                            <span className="font-bold text-gray-900">
                                {formatCurrency(vendor.totalSales)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Full Table */}
            <div className="col-span-full rounded-lg bg-white p-4 mt-4">
                <h2 className="text-lg font-bold mb-4 text-gray-900">
                    Resumen de Ventas por Vendedor
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 font-semibold text-gray-600">Vendedor</th>
                                <th className="px-4 py-2 font-semibold text-gray-600 text-right">Ventas Totales</th>
                                <th className="px-4 py-2 font-semibold text-gray-600 text-right">Unidades</th>
                                <th className="px-4 py-2 font-semibold text-gray-600 text-right"># Ventas</th>
                                <th className="px-4 py-2 font-semibold text-gray-600 text-right">Margen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((vendor, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-2 text-gray-800 font-medium">{vendor.nombre}</td>
                                    <td className="px-4 py-2 text-right text-gray-900 font-bold">
                                        {formatCurrency(vendor.totalSales)}
                                    </td>
                                    <td className="px-4 py-2 text-right text-gray-700">{vendor.totalUnits}</td>
                                    <td className="px-4 py-2 text-right text-gray-700">{vendor.numSales}</td>
                                    <td className="px-4 py-2 text-right text-gray-700">
                                        {formatCurrency(vendor.margin)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}