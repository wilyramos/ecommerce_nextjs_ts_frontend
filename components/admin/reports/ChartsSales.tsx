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

type Props = {
    data: { name: string; ventas: number }[];
    dateRange?: {
        from: Date;
        to: Date;
    };
};

export default function ChartsSales({ data, dateRange }: Props) {
    const formattedFrom = dateRange
        ? format(dateRange.from, "dd MMM yyyy", { locale: es })
        : null;

    const formattedTo = dateRange
        ? format(dateRange.to, "dd MMM yyyy", { locale: es })
        : null;

    return (
        <div className="w-full bg-white space-y-4">
            <div className="flex justify-between items-center">
                {formattedFrom && formattedTo && (
                    <span className="text-sm text-gray-500">
                        {formattedFrom} — {formattedTo}
                    </span>
                )}
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            padding={{ left: 30, right: 30 }} // ← este espacio hace la diferencia
                        />
                        <YAxis
                            tickFormatter={(value) => `S/. ${value}`}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value: number) => [`S/. ${value}`, "Ventas"]}
                            labelClassName="text-sm"
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="ventas"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Ventas"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
