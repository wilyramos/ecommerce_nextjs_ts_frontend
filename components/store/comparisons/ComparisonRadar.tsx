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

const COLORS = ["#171717", "#737373", "#a3a3a3", "#525252"];

interface Props {
    specs: ComparisonSpec[];
    products: (string | PopulatedProduct)[];
}

export default function ComparisonRadar({ specs, products }: Props) {
    const radarSpecs = specs.filter((s) => s.scores?.length >= 2);
    if (!radarSpecs.length) return null;

    const productNames = products.map((p, i) =>
        typeof p === "object" ? p.nombre : `Producto ${i + 1}`
    );

    const data = radarSpecs.map((spec) => {
        const row: Record<string, string | number> = { subject: spec.key };
        products.forEach((_, i) => {
            row[`prod${i}`] = spec.scores[i] ?? 0;
        });
        return row;
    });

    return (
        <div className="border border-border p-4 bg-card">
            <ResponsiveContainer width="100%" height={340}>
                <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    {products.map((_, i) => (
                        <Radar
                            key={i}
                            name={productNames[i]}
                            dataKey={`prod${i}`}
                            stroke={COLORS[i % COLORS.length]}
                            fill={COLORS[i % COLORS.length]}
                            fillOpacity={0.15}
                            strokeWidth={1.5}
                            strokeDasharray={i === 0 ? undefined : "4 4"}
                        />
                    ))}
                    <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        contentStyle={{
                            fontSize: 12,
                            borderRadius: 0,
                            border: "1px solid var(--border)",
                            background: "var(--background)",
                            color: "var(--foreground)",
                        }}
                    />
                    <Legend
                        iconType="plainline"
                        iconSize={12}
                        wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)" }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}