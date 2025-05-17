import type { ProductsList } from "@/src/schemas";
import Link from "next/link";
import { FaEye } from "react-icons/fa";

export default function ProductsTable({ products }: { products: ProductsList }) {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold">Nombre</th>
                        <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Descripción</th>
                        <th className="px-4 py-2 text-left font-semibold hidden md:table-cell">Precio</th>
                        <th className="px-4 py-2 text-left font-semibold">Stock</th>
                        <th className="px-4 py-2 text-left font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-100 transition">
                            <td className="px-4 py-2 font-medium text-gray-900">{product.nombre}</td>
                            <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{product.descripcion}</td>
                            <td className="px-4 py-2 text-gray-700 hidden md:table-cell">${product.precio}</td>
                            <td className="px-4 py-2 text-gray-700">{product.stock}</td>
                            <td className="px-4 py-2 text-gray-700">
                                <Link href={`/admin/products/${product._id}`} className="hover:text-blue-600 text-gray-500">
                                    <FaEye className="inline-block mr-1" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
