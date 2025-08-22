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
    const formattedData = data.map((item) => {
        let newLabel = item.label;

        if (/^\d{4}-\d{2}$/.test(item.label)) {
            const [year, month] = item.label.split("-").map(Number);
            const localDate = new Date(year, month - 1);
            newLabel = format(localDate, "MMM yyyy", { locale: es });
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(item.label)) {
            const [year, month, day] = item.label.split("-").map(Number);
            const localDate = new Date(year, month - 1, day);
            newLabel = format(localDate, "dd MMM", { locale: es });
        }

        return { ...item, label: newLabel };
    });

    return (
        <div className="w-full">
            <h2 className="px-4 text-gray-700 font-semibold">Ventas</h2>

            <ResponsiveContainer width="100%" height={360}>
                <LineChart
                    data={formattedData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        padding={{ left: 10, right: 10 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                            padding: "8px 12px",
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
                        stroke="#0EA5E9" // Celeste principal
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Ventas"
                    />
                    <Line
                        type="monotone"
                        dataKey="cantidadVentas"
                        stroke="#38BDF8" // Celeste medio
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="Cantidad de Ventas"
                    />
                    <Line
                        type="monotone"
                        dataKey="unidadesVendidas"
                        stroke="#0369A1" // Azul celeste oscuro
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
