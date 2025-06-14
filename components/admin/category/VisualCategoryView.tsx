import type { CategoriasList } from "@/src/schemas";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";

type CategoryWithChildren = CategoriasList[number] & {
    subcategories?: CategoriasList;
};

export default function VisualCategoryView({ categories }: { categories: CategoryWithChildren[] }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
                <div key={category._id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{category.nombre}</h3>
                            {category.descripcion && (
                                <p className="text-sm text-gray-500">{category.descripcion}</p>
                            )}
                        </div>
                        <Link
                            href={`/admin/products/category/${category._id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                            <FaEdit className="text-sm" />
                            Editar
                        </Link>
                    </div>

                    {category.subcategories?.length ? (
                        <div className="mt-2 flex flex-col gap-2">
                            {category.subcategories.map((sub) => (
                                <div
                                    key={sub._id}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full flex items-center justify-between gap-1 hover:bg-indigo-800 hover:text-white transition-colors "
                                >
                                    {sub.nombre}
                                    <Link
                                        href={`/admin/products/category/${sub._id}`}
                                        className=""
                                    >
                                        <FaEdit className="text-xs" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic mt-2">Sin subcategorías</p>
                    )}
                </div>
            ))}
        </div>
    );
}
