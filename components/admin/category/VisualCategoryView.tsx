"use client";

import type { CategoryListResponse } from "@/src/schemas";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

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
        <div className="space-y-8 mx-auto">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] || [];

                return (
                    <div
                        key={parent._id}
                        className="space-y-2 border-b pb-4 border-border"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">{parent.nombre}</h2>
                            <Link
                                href={`/admin/products/category/${parent._id}`}
                                className="text-xs hover:underline flex items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                                <FaEdit className="text-sm" />
                                Editar
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded border border-border">
                            <table className="min-w-full table-fixed text-xs">
                                <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-medium">
                                    <tr>
                                        <th className="px-3 py-2 w-1/3 text-left">Nombre</th>
                                        <th className="px-3 py-2 w-1/3 text-left">Descripción</th>
                                        <th className="px-3 py-2 w-1/3 text-right">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {subcategories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="px-3 py-4 text-center text-muted-foreground"
                                            >
                                                Sin subcategorías.
                                            </td>
                                        </tr>
                                    ) : (
                                        subcategories.map((subcat) => (
                                            <tr
                                                key={subcat._id}
                                                className="border-t border-border hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-3 py-2 truncate">
                                                    {subcat.nombre}
                                                </td>

                                                <td className="px-3 py-2 text-muted-foreground">
                                                    {subcat.descripcion}
                                                </td>

                                                <td className="px-3 py-2 text-right">
                                                    <Link
                                                        href={`/admin/products/category/${subcat._id}`}
                                                        className="text-muted-foreground hover:text-foreground hover:underline flex items-center justify-end gap-1"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
