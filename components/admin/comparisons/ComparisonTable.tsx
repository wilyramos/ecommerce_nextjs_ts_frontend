"use client";

import Link from "next/link";
import { useState } from "react";
import { Comparison } from "@/src/schemas/comparison.schema";
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
            <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] text-center">
                <p className="text-sm text-[var(--color-text-secondary)]">No se encontraron comparativas registradas.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <Table>
                <TableHeader className="bg-[var(--color-bg-secondary)]">
                    <TableRow>
                        <TableHead className="w-[40%]">Comparativa (Título / Slug)</TableHead>
                        <TableHead className="w-[25%]">Productos Analizados</TableHead>
                        <TableHead className="w-[10%] text-center">Visibilidad</TableHead>
                        <TableHead className="w-[10%] text-center">Destacado</TableHead>
                        <TableHead className="w-[10%] text-right">Lecturas</TableHead>
                        <TableHead className="w-[5%] text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comparisons.map((item) => {
                        const productNames = item.products
                            .map((p) => (typeof p === "object" && p !== null ? p.nombre : "Producto"))
                            .join(" vs ");

                        return (
                            <TableRow key={item._id} className="hover:bg-[var(--color-bg-secondary)]/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-[var(--color-text-primary)] font-semibold line-clamp-1">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-[var(--color-text-tertiary)] font-mono line-clamp-1">
                                            /{item.slug}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2.5 py-1 rounded-md border border-[var(--color-border-subtle)] line-clamp-1">
                                        {productNames}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs px-2 py-0.5">
                                        {item.isActive ? "Público" : "Borrador"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {item.isFeatured ? (
                                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs px-2 py-0.5">
                                            Destacado
                                        </Badge>
                                    ) : (
                                        <span className="text-xs text-[var(--color-text-tertiary)]">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-mono text-xs text-[var(--color-text-secondary)]">
                                    {item.viewCount?.toLocaleString() || 0}
                                </TableCell>
                                <TableCell className="text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-[var(--color-bg-secondary)]">
                                                <span className="sr-only">Abrir menú</span>
                                                <span className="font-bold text-center block w-full text-sm">···</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/comparisons/edit/${item._id}`} className="cursor-pointer w-full">
                                                    Editar datos
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <a href={`/comparativas/${item.slug}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer w-full">
                                                    Ver en tienda ↗
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setActiveTarget({ id: item._id, slug: item.slug })}
                                                className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/30 cursor-pointer"
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