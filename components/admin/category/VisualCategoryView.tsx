// File: frontend/components/admin/category/VisualCategoryView.tsx

"use client";

import type { CategoryListResponse } from "@/src/schemas/category.schema";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { H2 } from "@/components/ui/Typography";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

type Props = {
    categories: CategoryListResponse;
};

export default function VisualCategoryView({ categories }: Props) {
    const grouped = categories.reduce((acc, category) => {
        const parentId =
            category.parent && typeof category.parent !== "string"
                ? category.parent._id
                : category.parent || "root";

        if (!acc[parentId]) acc[parentId] = [];
        acc[parentId].push(category);

        return acc;
    }, {} as Record<string, CategoryListResponse>);

    const rootCategories = grouped["root"] || [];

    return (
        <div className="space-y-6 mx-auto">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] || [];

                return (
                    <div
                        key={parent._id}
                        className="space-y-2 border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                        <div className="flex justify-between items-center px-1 select-none">
                            <H2>{parent.nombre}</H2>
                            <Link
                                href={`/admin/products/category/${parent._id}`}
                                className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-action-cta flex items-center gap-1 transition-colors focus-visible:outline-hidden"
                            >
                                <FaEdit className="text-sm" />
                                Editar Matriz
                            </Link>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-1/3">Nombre Subcategoría</TableHead>
                                    <TableHead className="w-1/3">Descripción</TableHead>
                                    <TableHead className="w-1/3 text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {subcategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            className="text-center py-6 text-muted-foreground font-semibold"
                                        >
                                            Sin subcategorías vinculadas.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    subcategories.map((subcat) => (
                                        <TableRow key={subcat._id}>
                                            <TableCell className="font-bold">
                                                {subcat.nombre}
                                            </TableCell>

                                            <TableCell className="text-muted-foreground">
                                                {subcat.descripcion || "—"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
                                                    <Link
                                                        href={`/admin/products/category/${subcat._id}`}
                                                        className="text-muted-foreground hover:text-action-cta p-1 rounded-[var(--radius-sm)] transition-colors focus-visible:outline-hidden"
                                                    >
                                                        <FaEdit className="text-sm" />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
}