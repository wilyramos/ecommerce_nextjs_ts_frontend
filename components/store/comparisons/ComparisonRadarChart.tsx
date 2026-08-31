// File: frontend/components/store/comparisons/ComparisonRadarChart.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Legend,
    Tooltip,
    type TooltipProps,
} from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import type { ComparisonSpec } from "@/src/schemas/comparison.schema";

// Importación de tu TypographyStore
import { H4, P, Small } from "@/components/ui/TypographyStore";

interface ComparisonRadarChartProps {
    products: ProductSearchResult[];
    especificaciones: ComparisonSpec[];
    colors: string[];
}

// Tooltip personalizado usando tipografía oficial
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-border p-4 rounded-xl shadow-lg min-w-[190px]">
                <H4 className="mb-3 border-b border-border pb-2 text-foreground">
                    {label}
                </H4>
                <div className="space-y-2.5">
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span 
                                    className="w-2.5 h-2.5 rounded-full shadow-xs flex-shrink-0" 
                                    style={{ backgroundColor: entry.color }} 
                                />
                                <P className="m-0 truncate max-w-[120px] font-medium leading-none">
                                    {entry.name}
                                </P>
                            </div>
                            <Small className="font-bold text-foreground font-mono m-0 leading-none">
                                {entry.value} pts
                            </Small>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function ComparisonRadarChart({
    products,
    especificaciones,
    colors,
}: ComparisonRadarChartProps) {
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const data = useMemo(() => {
        const chartData = especificaciones.map((spec, index) => {
            const entry: Record<string, string | number> = {
                subject: spec.key?.trim() ? spec.key : `Criterio ${index + 1}`,
            };

            products.forEach((product, pIndex) => {
                const scoreValue = Number(spec.scores?.[pIndex]);
                entry[`product_${product._id}`] = isNaN(scoreValue)
                    ? 0
                    : Math.min(100, Math.max(0, scoreValue));
            });

            return entry;
        });

        if (chartData.length > 0 && chartData.length < 3) {
            const needed = 3 - chartData.length;
            for (let i = 0; i < needed; i++) {
                const phantomEntry: Record<string, string | number> = { subject: ` ` };
                products.forEach((product) => {
                    phantomEntry[`product_${product._id}`] = 0; 
                });
                chartData.push(phantomEntry);
            }
        }

        return chartData;
    }, [especificaciones, products]);

    if (!isMounted) {
        return <div className="w-full h-[350px] sm:h-[450px] animate-pulse bg-muted/20 rounded-xl" />;
    }

    if (data.length === 0) return null;

    return (
        <div className="w-full h-[350px] sm:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500 }}
                    />
                    
                    <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} 
                        axisLine={false} 
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Legend 
                        wrapperStyle={{ fontSize: "12px", paddingTop: "20px", fontWeight: 500 }} 
                        iconType="circle" 
                    />
                    
                    {products.map((product, idx) => (
                        <Radar
                            key={product._id}
                            name={product.nombre}
                            dataKey={`product_${product._id}`}
                            stroke={colors[idx % colors.length]}
                            strokeWidth={2}
                            fill={colors[idx % colors.length]}
                            fillOpacity={0.4}
                            dot={{ r: 3, fill: colors[idx % colors.length], strokeWidth: 1, stroke: "#fff" }}
                            activeDot={{ 
                                r: 6, 
                                fill: colors[idx % colors.length], 
                                stroke: "#fff", 
                                strokeWidth: 2,
                                className: "drop-shadow-md" 
                            }}
                        />
                    ))}
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}