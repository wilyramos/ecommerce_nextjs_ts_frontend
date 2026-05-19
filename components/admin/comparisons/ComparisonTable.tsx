"use client";

import Link from "next/link";
import { useState } from "react";
import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { DeleteComparisonDialog } from "./DeleteComparisonDialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComparisonTableProps {
    comparisons: Comparison[];
}

export default function ComparisonTable({ comparisons }: ComparisonTableProps) {
    const [activeTarget, setActiveTarget] = useState<{ id: string; slug: string } | null>(null);

    if (comparisons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border bg-background-secondary/50 text-center">
                <p className="text-sm text-muted-foreground font-medium">No se encontraron comparativas registradas.</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-background">
            <Table>
                <TableHeader className="bg-background-secondary/70">
                    <TableRow className="border-b border-border hover:bg-background-secondary/70">
                        <TableHead className="w-[45%] text-left font-semibold text-xs uppercase tracking-wider h-11 text-muted-foreground">Comparativa (Título / Slug)</TableHead>
                        <TableHead className="w-[25%] text-left font-semibold text-xs uppercase tracking-wider h-11 text-muted-foreground">Productos Analizados</TableHead>
                        <TableHead className="w-[10%] text-center font-semibold text-xs uppercase tracking-wider h-11 text-muted-foreground">Visibilidad</TableHead>
                        <TableHead className="w-[10%] text-center font-semibold text-xs uppercase tracking-wider h-11 text-muted-foreground">Destacado</TableHead>
                        <TableHead className="w-[10%] text-right font-semibold text-xs uppercase tracking-wider h-11 text-muted-foreground">Lecturas</TableHead>
                        <TableHead className="w-[5%] h-11"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                    {comparisons.map((item) => {
                        // Resuelve nombres de forma segura basándose en tu esquema Zod estricto sin tipos any
                        const productNames = item.products
                            .map((p) => (typeof p === "object" && p !== null ? (p as PopulatedProduct).nombre : "Producto"))
                            .join(" vs ");

                        return (
                            <TableRow key={item._id} className="hover:bg-background-secondary/40 transition-colors border-b border-border last:border-0">
                                <TableCell className="py-3.5">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-foreground font-semibold line-clamp-1">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground font-mono tracking-tight line-clamp-1">
                                            /{item.slug}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3.5">
                                    <span className="text-xs font-semibold text-foreground/90 bg-background-secondary px-2.5 py-1 rounded border border-border/60 line-clamp-1 max-w-[260px] w-fit">
                                        {productNames}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center py-3.5">
                                    <Badge variant={item.isActive ? "default" : "secondary"} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                        {item.isActive ? "Público" : "Borrador"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center py-3.5">
                                    {item.isFeatured ? (
                                        <Badge className="bg-action-cta text-action-cta-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded hover:bg-action-cta-hover">
                                            Destacado
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/50">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs text-muted-foreground py-3.5">
                                    {item.viewCount?.toLocaleString() || 0}
                                </TableCell>
                                <TableCell className="text-center py-3.5">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-md hover:bg-background-secondary">
                                                <span className="sr-only">Abrir menú</span>
                                                <span className="font-bold text-center block w-full text-sm tracking-tight">···</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44 border border-border bg-background">
                                            <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator className="bg-border" />
                                            <DropdownMenuItem asChild className="focus:bg-background-secondary cursor-pointer text-sm">
                                                <Link href={`/admin/comparisons/edit/${item._id}`} className="w-full">
                                                    Editar datos
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild className="focus:bg-background-secondary cursor-pointer text-sm">
                                                <a href={`/comparativas/${item.slug}`} target="_blank" rel="noopener noreferrer" className="w-full">
                                                    Ver en tienda ↗
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-border" />
                                            <DropdownMenuItem
                                                onClick={() => setActiveTarget({ id: item._id, slug: item.slug })}
                                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-sm font-semibold"
                                            >
                                                Eliminar
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <DeleteComparisonDialog
                id={activeTarget?.id || ""}
                slug={activeTarget?.slug || ""}
                open={activeTarget !== null}
                onOpenChange={(isOpen) => !isOpen && setActiveTarget(null)}
            />
        </div>
    );
}