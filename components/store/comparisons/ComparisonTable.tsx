// File: frontend/components/store/comparisons/ComparisonTable.tsx

import { ComparisonSpec, PopulatedProduct } from "@/src/schemas/comparison.schema";

interface Props {
    products: (string | PopulatedProduct)[];
    specs:    ComparisonSpec[];
}

export default function ComparisonTable({ products, specs }: Props) {
    if (!specs.length) return null;

    const names = products.map((p, i) =>
        typeof p === "object" ? p.nombre : `Producto ${i + 1}`
    );

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm table-fixed">
                <thead>
                    <tr className="bg-muted-neutral border-b border-border">
                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-1/4">
                            Característica
                        </th>
                        {names.map((name, i) => (
                            <th key={i} className="text-left px-4 py-3 font-semibold text-primary">
                                {name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {specs.map((spec, i) => (
                        <tr
                            key={i}
                            className={[
                                "border-b border-border last:border-0 transition-colors",
                                spec.isKeyDifference
                                    ? "bg-primary/[0.02]"
                                    : "hover:bg-muted-neutral/30",
                            ].join(" ")}
                        >
                            <td className="px-4 py-3 font-medium text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    {spec.isKeyDifference && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    )}
                                    {spec.key}
                                </div>
                            </td>
                            {spec.values.map((val, j) => (
                                <td key={j} className="px-4 py-3 text-foreground">
                                    {val || <span className="text-muted-foreground">—</span>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {specs.some(s => s.isKeyDifference) && (
                <p className="px-4 py-2 text-xs text-muted-foreground border-t border-border flex items-center gap-1.5 bg-muted-neutral">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    Diferencia clave entre productos
                </p>
            )}
        </div>
    );
}