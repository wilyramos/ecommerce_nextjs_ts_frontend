// File: frontend/components/store/comparisons/ComparisonRadar.tsx
"use client";

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { ComparisonSpec, PopulatedProduct } from "@/src/schemas/comparison.schema";

const COLORS = ["#185FA5", "#3B6D11", "#993C1D", "#534AB7"];

interface Props {
    specs: ComparisonSpec[];
    products: (string | PopulatedProduct)[];
}

export default function ComparisonRadar({ specs, products }: Props) {
    const radarSpecs = specs.filter(s => s.scores?.length >= 2);
    if (!radarSpecs.length) return null;

    const productNames = products.map((p, i) =>
        typeof p === "object" ? p.nombre : `Producto ${i + 1}`
    );

    // Recharts radar espera un array de objetos { subject, prod0, prod1, ... }
    const data = radarSpecs.map(spec => {
        const row: Record<string, string | number> = { subject: spec.key };
        products.forEach((_, i) => { row[`prod${i}`] = spec.scores[i] ?? 0; });
        return row;
    });

    return (
        <div className="space-y-2">
            <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 12 }}
                    />
                    {products.map((_, i) => (
                        <Radar
                            key={i}
                            name={productNames[i]}
                            dataKey={`prod${i}`}
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                            fillOpacity={0.12}
                            strokeWidth={2}
                            strokeDasharray={i === 0 ? undefined : "5 3"}
                        />
                    ))}
                    <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        contentStyle={{
                            fontSize: 12,
                            borderRadius: 8,
                            border: "0.5px solid var(--border)",
                            background: "var(--background)",
                        }}
                    />
                    <Legend
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 12 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}