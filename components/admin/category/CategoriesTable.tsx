import type { CategoriasList } from "@/src/schemas";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";


export default function CategoriesTable({ categories }: { categories: CategoriasList }) {

    return (
        <>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                            <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Descripción</th>
                            <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category._id} className="hover:bg-gray-100 transition">
                                <td className="px-4 py-2 font-medium text-gray-900">{category.nombre}</td>
                                <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{category.descripcion}</td>
                                <td className="px-4 py-2 text-gray-700">
                                    <Link href={`/admin/products/category/${category._id}`} className="hover:text-blue-600 text-gray-500">
                                        <FaEdit className="inline-block mr-1" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
