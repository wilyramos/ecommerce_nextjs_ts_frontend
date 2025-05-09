import Link from "next/link";
import { CategoriesAPIResponse } from "@/src/schemas";

async function getCategories() {
    const url = `${process.env.API_URL}/category/list`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const json = await res.json();
    const categories = CategoriesAPIResponse.parse(json);
    return categories;
}

export default async function CreatePageCategory() {
    
    const categories = await getCategories();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Categorías</h1>
                <Link
                    href="/admin/products/category/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    + Nueva Categoría
                </Link>
            </div>

            <div className="mb-6">
                <Link
                    href="/admin/products"
                    className="text-blue-500 hover:underline"
                >
                    Ver Todos los Productos
                </Link>
            </div>

            <div className="flex flex-col gap-1">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className=""
                    >
                        <Link
                            href={`/admin/products/category/${category._id}`}
                            className="flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <p className=" font-semibold text-gray-600 hover:text-blue-500 transition">
                                    {category.nombre}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {category.descripcion}
                                </p>
                            </div>
                            <span className="text-gray-500">

                            </span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}