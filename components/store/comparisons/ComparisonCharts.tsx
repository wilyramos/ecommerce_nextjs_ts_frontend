// File: frontend/components/store/comparisons/ComparisonCharts.tsx

import { Comparison, ComparisonSpec, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComparisonChartsProps {
    products: Comparison["products"];
    specs: ComparisonSpec[];
}

// Paleta de colores para cada producto (hasta 4)
const PRODUCT_COLORS = [
    { bar: "bg-action-cta", text: "text-action-cta", label: "bg-action-cta/10 text-action-cta border-action-cta/20" },
    { bar: "bg-blue-500",   text: "text-blue-500",   label: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400" },
    { bar: "bg-violet-500", text: "text-violet-500", label: "bg-violet-500/10 text-violet-600 border-violet-200 dark:text-violet-400" },
    { bar: "bg-emerald-500",text: "text-emerald-500",label: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400" },
];

export default function ComparisonCharts({ products, specs }: ComparisonChartsProps) {
    const numericSpecs = specs.filter(
        (spec) =>
            spec.isKeyDifference &&
            spec.values.every((v) => !isNaN(parseFloat(v.replace(/[^0-9.]/g, ""))))
    );

    if (numericSpecs.length === 0) return null;

    const getProductName = (product: Comparison["products"][number], idx: number): string => {
        if (typeof product === "object" && product !== null) {
            return (product as PopulatedProduct).nombre;
        }
        return `Producto ${idx + 1}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {numericSpecs.map((spec, sIdx) => {
                const nums = spec.values.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")));
                const maxVal = Math.max(...nums);

                return (
                    <Card key={sIdx} className="border border-border bg-background shadow-none">
                        <CardHeader className="pb-3 pt-5 px-5">
                            <div className="flex items-center justify-between gap-2">
                                <CardTitle className="text-sm font-bold text-foreground">
                                    {spec.key}
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className="text-[9px] font-bold uppercase tracking-wide text-action-cta border-action-cta/30"
                                >
                                    Diferencia clave
                                </Badge>
                            </div>
                            {spec.explanation && (
                                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                                    {spec.explanation}
                                </p>
                            )}
                        </CardHeader>

                        <CardContent className="px-5 pb-5 space-y-3.5">
                            {products.map((product, pIdx) => {
                                const nombre = getProductName(product, pIdx);
                                const val = nums[pIdx];
                                const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                                const isWinner = val === maxVal;
                                const color = PRODUCT_COLORS[pIdx % PRODUCT_COLORS.length];

                                return (
                                    <div key={pIdx} className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className={`text-xs font-medium truncate max-w-[180px] ${
                                                    isWinner ? "text-foreground font-semibold" : "text-muted-foreground"
                                                }`}
                                            >
                                                {nombre}
                                            </span>
                                            <span className={`font-mono text-xs font-bold shrink-0 ${color.text}`}>
                                                {spec.values[pIdx]}
                                                {isWinner && (
                                                    <span className="ml-1 text-[10px]">★</span>
                                                )}
                                            </span>
                                        </div>

                                        {/* Barra */}
                                        <div className="relative h-2 w-full bg-background-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${color.bar} ${
                                                    !isWinner ? "opacity-40" : ""
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}