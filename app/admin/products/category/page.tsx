import Link from "next/link";
import { CategoryAPIResponse } from "@/src/schemas";

async function getCategories() {
    const url = `${process.env.API_URL}/category/list`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const json = await res.json();
    const categories = CategoryAPIResponse.parse(json);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div
                        key={category._id}
                        className="border rounded-lg shadow hover:shadow-lg transition-shadow p-6 bg-white"
                    >
                        <h2 className="text-xl font-semibold mb-2">{category.nombre}</h2>
                        <p className="text-gray-600 mb-4">
                            {category.descripcion || "Sin descripción."}
                        </p>
                        <Link
                            href={`/admin/products/category/${category._id}`}
                            className="inline-block text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
                        >
                            Ver Productos
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
