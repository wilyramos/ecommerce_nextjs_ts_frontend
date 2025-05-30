import type { CategoriasList } from "@/src/schemas";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import React from "react";

type CategoryWithChildren = CategoriasList[number] & {
    subcategories?: CategoriasList;
};

export default function CategoriesTable({ categories }: { categories: CategoryWithChildren[] }) {
    const renderCategoryRow = (category: CategoryWithChildren, depth = 0) => {
        const paddingLeft = `pl-${Math.min(depth * 4, 12)}`; // evita que se pase de pl-12

        return (
            <React.Fragment key={category._id}>
                <tr className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-xs text-gray-500">{category._id}</td>
                    <td className={`py-2 font-medium text-gray-900 ${paddingLeft}`}>
                        <span className="flex items-center gap-2">
                            {depth > 0 && <span className="text-gray-400">↳</span>}
                            {category.nombre}
                        </span>
                    </td>
                    <td className="px-4 py-2 hidden md:table-cell text-gray-700 text-sm">
                        {category.descripcion || <span className="italic text-gray-400">Sin descripción</span>}
                    </td>
                    <td className="px-4 py-2">
                        <Link
                            href={`/admin/products/category/${category._id}`}
                            className="text-blue-600 hover:text-blue-800 transition"
                        >
                            <FaEdit className="inline-block mr-1" />
                            Editar
                        </Link>
                    </td>
                </tr>

                {/* Subcategorías recursivas */}
                {category.subcategories?.map((sub) => renderCategoryRow(sub, depth + 1))}
            </React.Fragment>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 font-semibold text-gray-900">ID</th>
                        <th className="px-4 py-2 font-semibold text-gray-900">Nombre</th>
                        <th className="px-4 py-2 font-semibold text-gray-900 hidden md:table-cell">Descripción</th>
                        <th className="px-4 py-2 font-semibold text-gray-900">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {categories.map((category) => renderCategoryRow(category))}
                </tbody>
            </table>
        </div>
    );
}