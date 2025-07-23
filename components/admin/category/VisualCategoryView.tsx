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

    // Extraer categorías raíz
    const rootCategories = grouped["root"] || [];

    return (
        <div className="space-y-8">
            {rootCategories.map((parent) => {
                const subcategories = grouped[parent._id] || [];

                return (
                    <div key={parent._id}>
                        {/* Título principal */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold text-gray-800">{parent.nombre}</h2>
                            <Link
                                href={`/admin/products/category/${parent._id}`}
                                className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                            >
                                <FaEdit className="text-sm" />
                                Editar
                            </Link>
                        </div>

                        {/* Subcategorías */}
                        <ul className="space-y-2 pl-4 border-l border-gray-200">
                            {subcategories.length === 0 ? (
                                <li className="text-sm text-gray-500">Sin subcategorías.</li>
                            ) : (
                                subcategories.map((subcat) => (
                                    <li
                                        key={subcat._id}
                                        className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {subcat.nombre}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {subcat.descripcion}
                                            </p>

                                        </div>
                                        <Link
                                            href={`/admin/products/category/${subcat._id}`}
                                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                                        >
                                            <FaEdit className="text-xs" />
                                            Editar
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
