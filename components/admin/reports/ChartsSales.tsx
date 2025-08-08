"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type DataPoint = {
    label: string;
    ventas: number;
    cantidadVentas: number;
    unidadesVendidas: number;
};

type Props = {
    data: DataPoint[];
};

export default function ChartsSales({ data }: Props) {
    const formattedData = data.map((item) => ({
        ...item,
        label: format(new Date(item.label), "dd MMM", { locale: es }),
    }));

    return (
        <div className="w-full rounded-xl bg-white p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Resumen de ventas</h2>

            <ResponsiveContainer width="100%" height={360}>
                <LineChart data={formattedData}>
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        padding={{ left: 20, right: 20 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                        labelStyle={{ color: "#6b7280", fontSize: 12 }}
                        formatter={(value: number, name: string) => {
                            if (name === "ventas") return [`S/. ${value.toFixed(2)}`, "Ventas"];
                            if (name === "cantidadVentas") return [value, "Cantidad de Ventas"];
                            if (name === "unidadesVendidas") return [value, "Unidades Vendidas"];
                            return [value, name];
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="ventas"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Ventas"
                    />
                    <Line
                        type="monotone"
                        dataKey="cantidadVentas"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Cantidad de Ventas"
                    />
                    <Line
                        type="monotone"
                        dataKey="unidadesVendidas"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Unidades Vendidas"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
