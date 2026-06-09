// File: frontend/components/store/comparisons/ComparisonCharts.tsx
"use client";

import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { Card, CardContent } from "@/components/ui/card";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

interface ComparisonChartsProps {
    analisisEditorial: Comparison["analisisEditorial"];
    products: Comparison["products"];
}

interface ChartDataPoint {
    criterion: string;
    [key: string]: string | number;
}

// Paleta de colores para Recharts
const CHART_COLORS = [
    "#10b981", // Emerald 500
    "#3b82f6", // Blue 500
    "#8b5cf6", // Purple 500
    "#f59e0b", // Amber 500
];

export default function ComparisonCharts({ analisisEditorial, products }: ComparisonChartsProps) {
    if (!analisisEditorial || analisisEditorial.length === 0) return null;

    const firstProductScores = analisisEditorial[0]?.scores || [];
    if (firstProductScores.length === 0) return null;

    // Helper tipado para obtener el nombre real
    const getProductName = (product: string | PopulatedProduct, idx: number): string => {
        return product && typeof product === "object" ? product.nombre : `Modelo ${idx + 1}`;
    };

    // Transformar la data al formato de matriz cruzada
    const chartData: ChartDataPoint[] = firstProductScores.map((scoreObj, sIdx) => {
        const dataPoint: ChartDataPoint = { criterion: scoreObj.criterion };

        analisisEditorial.forEach((edItem, pIdx) => {
            const productName = getProductName(products[pIdx], pIdx);
            dataPoint[productName] = edItem.scores?.[sIdx]?.score ?? 0;
        });

        return dataPoint;
    });

    return (
        <Card className="">

            <CardContent className="p-6">
                <div className="w-full h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                            {/* Rejilla de fondo */}
                            <PolarGrid stroke="currentColor" className="text-border" />

                            {/* Eje de categorías (Textos alrededor) */}
                            <PolarAngleAxis
                                dataKey="criterion"
                                tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700 }}
                                className="text-foreground"
                            />

                            {/* Líneas de escala numérica interna (0 - 100) */}
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: 'currentColor', fontSize: 10 }}
                                tickCount={5}
                            />

                            {/* Tooltip flotante interactivo */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ fontWeight: 600 }}
                                formatter={(value: number, name: string) => [`${value} pts`, name]}
                            />

                            {/* Leyenda inferior */}
                            <Legend
                                wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
                                iconType="circle"
                            />

                            {/* Generar un polígono (Radar) por cada producto */}
                            {products.map((product, pIdx) => {
                                const productName = getProductName(product, pIdx);
                                const color = CHART_COLORS[pIdx % CHART_COLORS.length];

                                return (
                                    <Radar
                                        key={pIdx}
                                        name={productName}
                                        dataKey={productName}
                                        stroke={color}
                                        strokeWidth={2}
                                        fill={color}
                                        fillOpacity={0.4}
                                        activeDot={{ r: 6, fill: color, strokeWidth: 0 }}
                                    />
                                );
                            })}
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}