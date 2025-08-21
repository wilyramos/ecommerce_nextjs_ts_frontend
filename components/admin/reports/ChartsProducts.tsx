"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LabelList,
} from "recharts";
import { formatCurrency } from "@/src/utils/formatCurrency";

type ProductData = {
    productId: string;
    nombre: string;
    margin: number;
    totalQuantity: number;
    totalSales: number;
}[];

// Custom label for the bar chart - Simplified and styled for a modern look
const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
        <text
            x={x + width + 5}
            y={y}
            dy={4}
            fill="#555" // A slightly darker gray for better contrast
            fontSize={12}
            textAnchor="start"
            className="font-sans" // Using a standard sans-serif font
        >
            {formatCurrency(value)}
        </text>
    );
};

export default function ChartsProducts({ data }: { data: ProductData }) {
    const maxSales = Math.max(...data.map((item) => item.totalSales));

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Product Sales Chart - Minimalist Design */}
            <div className="flex-1 rounded-lg bg-white p-6">
                <h2 className="mb-6 text-sm font-extrabold text-gray-700">
                    Total Sales by Product:
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 10, right: 90, left: 100, bottom: 10 }}
                        barSize={12}
                        barCategoryGap={10}
                    >
                        <XAxis
                            type="number"
                            tickFormatter={formatCurrency}
                            axisLine={false}
                            tickLine={false}
                            stroke="#e0e0e0" // Lighter color for axes
                            tick={{ fontSize: 12, fill: "#888" }}
                            domain={[0, maxSales * 1.1]}
                        />
                        <YAxis
                            dataKey="nombre"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 13, fill: "#555" }}
                            width={120}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelStyle={{
                                color: "#333",
                                fontSize: "14px",
                                fontWeight: "bold",
                            }}
                            contentStyle={{
                                background: "white",
                                border: "1px solid #ccc", // Lighter border
                                borderRadius: "4px",
                                fontSize: "12px",
                                padding: "8px",
                            }}
                        />
                        <Bar
                            dataKey="totalSales"
                            fill="#007bff" // Modern blue color
                            radius={[0, 4, 4, 0]} // Slightly more rounded
                            name="Total Sales"
                        >
                            <LabelList dataKey="totalSales" content={CustomLabel} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Product Details Table - Clean and Simple Design */}
            <div className="flex-1 overflow-x-auto rounded-lg bg-white p-6">
                <h2 className="mb-6 text-sm font-extrabold text-gray-700">
                    Product Details:
                </h2>
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500">
                            <th className="py-2 text-left font-medium">Product</th>
                            <th className="py-2 text-right font-medium">Quantity</th>
                            <th className="py-2 text-right font-medium">Sales</th>
                            <th className="py-2 text-right font-medium">Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p) => (
                            <tr
                                key={p.productId}
                                className="border-b border-gray-100 last:border-b-0"
                            >
                                <td className="py-3 text-gray-700">{p.nombre}</td>
                                <td className="py-3 text-right text-gray-700">
                                    {p.totalQuantity}
                                </td>
                                <td className="py-3 text-right text-gray-700">
                                    {formatCurrency(p.totalSales)}
                                </td>
                                <td className="py-3 text-right text-gray-700">
                                    {formatCurrency(p.margin)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}