"use client";

import type { CategoryListResponse } from "@/src/schemas";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

type Props = {
    categories: CategoryListResponse;
};

export default function VisualCategoryView({ categories }: Props) {
    // Agrupar por parentId
    const grouped = categories.reduce((acc, category) => {
        const parentId =
            category.parent && typeof category.parent !== "string"
                ? category.parent._id
                : null;

        if (!acc[parentId ?? "root"]) {
            acc[parentId ?? "root"] = [];
        }

        acc[parentId ?? "root"].push(category);
        return acc;
    }, {} as Record<string, CategoryListResponse>);

    const rootCategories = grouped["root"] || [];

    return (
        <div className="space-y-8 p-4 ">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] || [];

                return (
                    <div key={parent._id} className="space-y-2 border-b border-gray-400">
                        {/* Título principal */}
                        <div className="flex justify-between items-center ">
                            <h2 className="text-lg font-semibold text-gray-800">{parent.nombre}</h2>
                            <Link
                                href={`/admin/products/category/${parent._id}`}
                                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                <FaEdit className="text-sm" />
                                Editar
                            </Link>
                        </div>

                        {/* Tabla de subcategorías */}
                        <div className="overflow-x-auto rounded border border-gray-100">
                            <table className="min-w-full table-fixed text-sm text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
                                    <tr>
                                        <th className="w-1/3 px-4 py-2">Nombre</th>
                                        <th className="w-1/3 px-4 py-2">Descripción</th>
                                        <th className="w-1/3 px-4 py-2 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subcategories.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                                                Sin subcategorías.
                                            </td>
                                        </tr>
                                    ) : (
                                        subcategories.map((subcat) => (
                                            <tr
                                                key={subcat._id}
                                                className="border-t border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-2 truncate">{subcat.nombre}</td>
                                                <td className="pc-4 py-2">{subcat.descripcion}</td>
                                                <td className="px-4 py-2 text-right">
                                                    <Link
                                                        href={`/admin/products/category/${subcat._id}`}
                                                        className="text-indigo-600 hover:underline flex items-center justify-end gap-1"
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
