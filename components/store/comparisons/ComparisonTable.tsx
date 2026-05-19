// File: frontend/components/store/comparisons/ComparisonTable.tsx

import React from "react";
import { ComparisonSpec } from "@/src/schemas/comparison.schema";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export interface PopulatedProduct {
    nombre: string;
    imagenes?: string[];
    precio?: number | string;
}

interface ComparisonTableProps {
    products: Array<string | PopulatedProduct>;
    specs: ComparisonSpec[];
}

// Intenta determinar qué índice "gana" en una spec (mayor número = mejor por defecto)
function getWinnerIndex(values: string[]): number | null {
    const nums = values.map((v) => parseFloat(v.replace(/[^0-9.]/g, "")));
    if (nums.some(isNaN)) return null;
    const max = Math.max(...nums);
    const winners = nums.reduce<number[]>((acc, n, i) => (n === max ? [...acc, i] : acc), []);
    return winners.length === 1 ? winners[0] : null;
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

    const renderValue = (val: string, isWinner: boolean) => {
        const lower = val?.trim().toLowerCase();
        if (!val || val === "—") return <span className="text-muted-foreground/30">—</span>;

        if (lower === "sí" || lower === "si" || lower === "true")
            return (
                <Badge variant="secondary" className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400">
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
            <span className={`text-sm ${isWinner ? "font-bold text-action-cta" : "font-normal text-foreground"}`}>
                {val}
                {isWinner && (
                    <span className="ml-1 text-[10px] text-action-cta align-super">★</span>
                )}
            </span>
        );
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="w-full overflow-x-auto rounded-xl border border-border">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow className="bg-background-secondary/60 hover:bg-background-secondary/60 border-b border-border">
                            <TableHead className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/4 h-auto">
                                Especificación
                            </TableHead>
                            {products.map((product, idx) => {
                                const pop = isPopulated(product) ? product : null;
                                const nombre = pop?.nombre ?? `Producto ${idx + 1}`;
                                const imagen = pop?.imagenes?.[0];

                                return (
                                    <TableHead key={idx} className="p-4 border-l border-border text-center h-auto align-middle w-1/4">
                                        <div className="flex flex-col items-center gap-2">
                                            {imagen && (
                                                <Image
                                                    src={imagen}
                                                    alt={nombre}
                                                    width={52}
                                                    height={52}
                                                    unoptimized
                                                    className="object-contain rounded"
                                                />
                                            )}
                                            <span className="text-xs md:text-sm font-bold text-foreground leading-snug line-clamp-2 max-w-[150px] block">
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
                                {/* Separador de categoría */}
                                <TableRow className="bg-background-secondary/40 hover:bg-background-secondary/40 border-b border-border">
                                    <TableCell
                                        colSpan={products.length + 1}
                                        className="py-2 px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                                    >
                                        {category}
                                    </TableCell>
                                </TableRow>

                                {items.map((spec, sIdx) => {
                                    const winnerIdx = spec.isKeyDifference ? getWinnerIndex(spec.values) : null;

                                    return (
                                        <TableRow
                                            key={sIdx}
                                            className={`border-b border-border last:border-0 transition-colors ${
                                                spec.isKeyDifference
                                                    ? "bg-action-cta/[0.03] hover:bg-action-cta/[0.06]"
                                                    : "hover:bg-background-secondary/30"
                                            }`}
                                        >
                                            <TableCell className="p-4 align-top">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {spec.key}
                                                        </span>
                                                        {spec.isKeyDifference && (
                                                            <Badge className="bg-action-cta/10 text-action-cta border-action-cta/20 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0">
                                                                Clave
                                                            </Badge>
                                                        )}
                                                        {spec.explanation && (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help shrink-0" />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-[220px] text-xs leading-relaxed">
                                                                    {spec.explanation}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {spec.values.map((val, vIdx) => (
                                                <TableCell
                                                    key={vIdx}
                                                    className={`p-4 text-center align-middle border-l border-border ${
                                                        winnerIdx === vIdx ? "bg-action-cta/5" : ""
                                                    }`}
                                                >
                                                    {renderValue(val, winnerIdx === vIdx)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </TooltipProvider>
    );
}