"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type ChartData = {
    productId: string;
    nombre: string;
    margin: number;
    totalQuantity: number;
    totalSales: number;
}[];

export default function ChartsProducts({ data }: { data: ChartData }) {
    return (
        <div className="space-y-8">
            {/* Gráfico */}
            <div className="p-4">
                <h2 className="text-lg font-light text-gray-700 mb-4">Top Productos</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                        barCategoryGap={18} // más espacio entre barras
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="nombre"
                            type="category"
                            tick={{ fontSize: 13 }}
                            width={140}
                        />
                        <Tooltip
                            formatter={(value: number) =>
                                new Intl.NumberFormat("es-PE", {
                                    style: "currency",
                                    currency: "PEN",
                                }).format(value)
                            }
                            labelClassName="text-sm"
                        />
                        <Bar
                            dataKey="totalSales"
                            fill="#4f46e5"
                            radius={[4, 4, 4, 4]}
                            barSize={14} // 👈 controla el grosor
                            name="Ventas Totales"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla */}
            <div className="p-4 bg-white overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600">
                            <th className="p-2 text-left">Producto</th>
                            <th className="p-2 text-right">Cantidad</th>
                            <th className="p-2 text-right">Ventas</th>
                            <th className="p-2 text-right">Margen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p) => (
                            <tr key={p.productId} className="hover:bg-gray-50 text-xs">
                                <td className="p-2 ">{p.nombre}</td>
                                <td className="p-2  text-right">{p.totalQuantity}</td>
                                <td className="p-2  text-right">
                                    {new Intl.NumberFormat("es-PE", {
                                        style: "currency",
                                        currency: "PEN",
                                    }).format(p.totalSales)}
                                </td>
                                <td className="p-2 text-right">
                                    {new Intl.NumberFormat("es-PE", {
                                        style: "currency",
                                        currency: "PEN",
                                    }).format(p.margin)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
