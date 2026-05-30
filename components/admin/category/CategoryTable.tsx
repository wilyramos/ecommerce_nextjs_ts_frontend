// File: components/admin/category/CategoryTable.tsx

"use client";

import type { CategoryListResponse, CategoryResponse } from "@/src/schemas/category.schema";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type Props = { categories: CategoryListResponse };

export default function CategoryTable({ categories }: Props) {
    // Agrupar por categoría padre
    const grouped = categories.reduce<Record<string, CategoryListResponse>>(
        (acc, cat) => {
            const parentId =
                cat.parent && typeof cat.parent !== "string"
                    ? cat.parent._id
                    : (cat.parent as string | null) ?? "root";

            acc[parentId] ??= [];
            acc[parentId].push(cat);
            return acc;
        },
        {}
    );

    const rootCategories = grouped["root"] ?? [];

    if (rootCategories.length === 0) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center min-h-[200px]">
                    <p className="text-muted-foreground text-sm">
                        No hay categorías disponibles.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] ?? [];

                return (
                    <Card key={parent._id}>
                        <CardHeader className="flex flex-row items-center justify-between py-3 px-5">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base">{parent.nombre}</CardTitle>
                                <Badge variant={parent.isActive ? "default" : "secondary"}>
                                    {parent.isActive ? "Activa" : "Inactiva"}
                                </Badge>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={`/admin/products/category/${parent._id}`}>
                                    <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                    Editar
                                </Link>
                            </Button>
                        </CardHeader>

                        <CardContent className="px-0 pb-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-5">Subcategoría</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right pr-5">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {subcategories.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="pl-5 py-4 text-muted-foreground text-sm"
                                            >
                                                Sin subcategorías vinculadas.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        subcategories.map((sub) => (
                                            <SubcategoryRow key={sub._id} sub={sub} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

function SubcategoryRow({ sub }: { sub: CategoryResponse }) {
    return (
        <TableRow>
            <TableCell className="pl-5 font-medium">{sub.nombre}</TableCell>
            <TableCell className="text-muted-foreground text-sm">
                {sub.descripcion || "—"}
            </TableCell>
            <TableCell>
                <Badge variant={sub.isActive ? "default" : "secondary"} className="text-xs">
                    {sub.isActive ? "Activa" : "Inactiva"}
                </Badge>
            </TableCell>
            <TableCell className="text-right pr-5">
                <Button asChild variant="ghost" size="icon">
                    <Link href={`/admin/products/category/${sub._id}`}>
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Editar {sub.nombre}</span>
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    );
}