// File: frontend/components/store/comparisons/ComparisonTable.tsx
import React from "react";
import { ComparisonSpec, PopulatedProduct } from "@/src/schemas/comparison.schema";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ComparisonTableProps {
    products: Array<string | PopulatedProduct>;
    specs: ComparisonSpec[];
}

export default function ComparisonTable({ products, specs }: ComparisonTableProps) {
    const groupedSpecs = specs.reduce((acc, spec) => {
        const cat = spec.category || "General";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(spec);
        return acc;
    }, {} as Record<string, ComparisonSpec[]>);

    const isPopulated = (p: string | PopulatedProduct): p is PopulatedProduct =>
        typeof p === "object" && p !== null;

    const renderValue = (val: string, isKeyDifference: boolean) => {
        const lower = val?.trim().toLowerCase();
        if (!val || val === "—") return <span className="text-muted-foreground/30">—</span>;

        if (lower === "sí" || lower === "si" || lower === "true")
            return (
                <Badge variant="secondary" className="text-xs font-semibold bg-success/10 text-success border-success/20">
                    Sí
                </Badge>
            );
        if (lower === "no" || lower === "false")
            return (
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground/60">
                    No
                </Badge>
            );

        return (
            <span className={`text-sm ${isKeyDifference ? "font-bold text-primary" : "font-normal text-foreground"}`}>
                {val}
            </span>
        );
    };

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
            <Table className="min-w-[600px]">
                <TableHeader>
                    <TableRow className="bg-muted-neutral border-b border-border hover:bg-muted-neutral">
                        <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4">
                            Especificación
                        </TableHead>
                        {products.map((product, idx) => {
                            const pop = isPopulated(product) ? product : null;
                            const nombre = pop?.nombre ?? `Producto ${idx + 1}`;
                            const imagen = pop?.imagenes?.[0];

                            return (
                                <TableHead key={idx} className="p-4 border-l border-border text-center w-1/4">
                                    <div className="flex flex-col items-center gap-2">
                                        {imagen && (
                                            <Image
                                                src={imagen}
                                                alt={nombre}
                                                width={48}
                                                height={48}
                                                unoptimized
                                                className="object-contain rounded"
                                            />
                                        )}
                                        <span className="text-xs font-bold text-foreground leading-snug line-clamp-2 max-w-[150px]">
                                            {nombre}
                                        </span>
                                    </div>
                                </TableHead>
                            );
                        })}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {Object.entries(groupedSpecs).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <TableRow className="bg-muted-neutral border-b border-border hover:bg-muted-neutral/80">
                                <TableCell
                                    colSpan={products.length + 1}
                                    className="py-2 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-neutral-foreground bg-muted-neutral"
                                >
                                    {category}
                                </TableCell>
                            </TableRow>

                            {items.map((spec, sIdx) => (
                                <TableRow
                                    key={sIdx}
                                    className={`border-b border-border last:border-0 transition-colors ${
                                        spec.isKeyDifference
                                            ? "bg-primary/[0.02] hover:bg-primary/[0.05]"
                                            : "hover:bg-muted-neutral/30"
                                    }`}
                                >
                                    <TableCell className="p-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {spec.key}
                                            </span>
                                            {spec.isKeyDifference && (
                                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0">
                                                    Diferencia
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>

                                    {spec.values.map((val, vIdx) => (
                                        <TableCell
                                            key={vIdx}
                                            className={`p-4 text-center align-middle border-l border-border ${
                                                spec.isKeyDifference ? "bg-primary/[0.01]" : ""
                                            }`}
                                        >
                                            {renderValue(val, spec.isKeyDifference ?? false)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}