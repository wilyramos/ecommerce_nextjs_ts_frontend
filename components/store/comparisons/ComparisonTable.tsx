// File: frontend/components/store/comparisons/ComparisonTable.tsx

import { ComparisonSpec, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { Table, Tr, Th, Td, Small } from "@/components/ui/TypographyStore";

interface Props {
    products: (string | PopulatedProduct)[];
    specs: ComparisonSpec[];
}

export default function ComparisonTable({ products, specs }: Props) {
    if (!specs.length) return null;

    const names = products.map((p, i) =>
        typeof p === "object" ? p.nombre : `Producto ${i + 1}`
    );

    return (
        <div className="space-y-2">
            <Table>
                <thead>
                    <Tr>
                        <Th className="w-1/4">Característica</Th>
                        {names.map((name, i) => (
                            <Th key={i}>{name}</Th>
                        ))}
                    </Tr>
                </thead>
                <tbody>
                    {specs.map((spec, i) => (
                        <Tr
                            key={i}
                            className={spec.isKeyDifference ? "bg-muted/30 font-medium" : undefined}
                        >
                            <Td className="font-medium text-foreground/90">
                                <div className="flex items-center gap-2">
                                    {spec.isKeyDifference && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                                    )}
                                    <span>{spec.key}</span>
                                </div>
                            </Td>
                            {spec.values.map((val, j) => (
                                <Td key={j}>
                                    {val || <span className="text-muted-foreground/60">—</span>}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </tbody>
            </Table>

            {specs.some((s) => s.isKeyDifference) && (
                <div className="flex items-center gap-2 px-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground inline-block" />
                    <Small>Diferencia clave entre productos</Small>
                </div>
            )}
        </div>
    );
}